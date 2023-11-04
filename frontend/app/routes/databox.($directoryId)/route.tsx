import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { ErrorRes, FilesRes } from "api/@types";
import axios from "axios";
import { css } from "styled-system/css";
import { Alert } from "~/components/atoms/Alert";
import { File } from "~/components/molecules/File";
import { routes } from "~/constants/routes";
import { apiClient } from "~/modules/api";
import { destroySession, getSession } from "~/modules/sessions";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const res = await apiClient(session.data.token).file.$get({
      body: {
        directory_id: params.directoryId,
      },
    });
    return json(res);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 403) {
        return redirect(routes.ROOT(), {
          headers: {
            "Set-Cookie": await destroySession(session),
          },
        });
      }

      const data = e.response?.data as ErrorRes;
      return json({ errors: { message: data.message } });
    }
    return json({
      errors: {
        message:
          "不明なエラーが発生しました。時間をおいてからもう一度お試しください。",
      },
    });
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if ("errors" in data && "message" in data.errors) {
    return (
      <>
        <Alert type="error">{data.errors.message}</Alert>
        <Outlet />
      </>
    );
  }

  return (
    <>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          columnGap: ".4rem",
          marginTop: "1rem",
        })}
      >
        {(data as FilesRes).path.map((path, index) => {
          if (!path.id) {
            return (
              <div
                key={"ROOT"}
                className={css({
                  display: "flex",
                  alignItems: "center",
                  columnGap: ".4rem",
                  color: "darkGray",
                })}
              >
                <Link
                  className={css({
                    padding: ".5rem",
                    transition: ".1s",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    md: {
                      fontSize: "1.5rem",
                    },
                    _hover: {
                      backgroundColor: "darkWhite",
                    },
                  })}
                  to={routes.DATABOX()}
                >
                  トップ
                </Link>
                <p
                  className={css({
                    color: "whiteGray",
                  })}
                >
                  {index === (data as FilesRes).path.length - 1 ? "" : ">"}
                </p>
              </div>
            );
          }
          return (
            <div
              key={path.id}
              className={css({
                display: "flex",
                alignItems: "center",
                columnGap: ".4rem",
                color: "darkGray",
              })}
            >
              <Link
                className={css({
                  padding: ".5rem",
                  transition: ".1s",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  md: {
                    fontSize: "1.5rem",
                  },
                  _hover: {
                    backgroundColor: "darkWhite",
                  },
                })}
                to={routes.DATABOX(path.id)}
              >
                {path.name}
              </Link>
              <p
                className={css({
                  color: "whiteGray",
                })}
              >
                {index === (data as FilesRes).path.length - 1 ? "" : ">"}
              </p>
            </div>
          );
        })}
      </div>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
          marginTop: "1rem",
          sm: {
            gridTemplateColumns: "1fr 1fr 1fr",
          },
        })}
      >
        {(data as FilesRes).files.map((file) => (
          <File key={file.id} file={file} />
        ))}
      </div>
      <Outlet />
    </>
  );
}
