import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import type { ErrorRes, FileObject } from "api/@types";
import axios from "axios";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";
import { Alert } from "~/components/atoms/Alert";
import { BlueButton } from "~/components/atoms/Button/blueButton";
import { RedButton } from "~/components/atoms/Button/redButton";
import { InputWithLabel } from "~/components/molecules/InputWithLabel";
import { Loading } from "~/components/molecules/Loading";
import { Modal } from "~/components/molecules/Modal";
import { routes } from "~/constants/routes";
import { apiClient } from "~/modules/api";
import { destroySession, getSession } from "~/modules/sessions";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const res = await apiClient(session.data.token).file._id(params.id!).$get();
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

type Errors = {
  errors: {
    id?: string;
    name?: string;
    message?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    return redirect(routes.ROOT());
  }

  const formData = await request.formData();

  const id = formData.get("id");
  const name = formData.get("name");
  const directoryId = formData.get("directory_id");

  const errorRes: Errors = { errors: {} };

  if (!id) {
    errorRes.errors.id = "IDは必須項目です。";
  }
  if (!name) {
    errorRes.errors.name = "名前は必須項目です。";
  }
  if (Object.values(errorRes.errors).length) {
    return json(errorRes);
  }

  try {
    await apiClient(session.get("token")).file.$put({
      body: {
        id: id!.toString(),
        name: name!.toString(),
        directory_id: directoryId?.toString(),
      },
    });

    return redirect(routes.DATABOX(directoryId?.toString()));
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const errorRes = e.response?.data as ErrorRes;
      if (errorRes && "message" in errorRes) {
        return json({
          errors: {
            message: errorRes.message,
          },
        });
      }
    }
    return json({
      errors: {
        message:
          "不明なエラーが発生しました。時間をおいてからもう一度お試しください。",
      },
    } as Errors);
  }
};

export default function Index() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    setIsLoading(false);
  }, [actionData]);

  if ("errors" in loaderData && "message" in loaderData.errors) {
    return (
      <>
        <Alert type="error">{loaderData.errors.message}</Alert>
      </>
    );
  }

  const onSubmit = () => {
    setIsLoading(true);
  };

  const loadedFileObject = loaderData as FileObject;

  return (
    <Modal
      className={css({
        width: "90vw",
        height: "90vh",
        padding: "2rem",
        md: {
          width: "50vw",
          height: "50vh",
        },
      })}
    >
      <Form
        className={css({
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        })}
        onSubmit={onSubmit}
        method="POST"
      >
        <div>
          <div
            className={css({
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            })}
          >
            <h1
              className={css({
                color: "darkGray",
                fontWeight: "bold",
                fontSize: "1.5rem",
              })}
            >
              ファイルの設定変更
            </h1>
            <Link
              className={css({
                color: "error",
                cursor: "pointer",
                fontSize: "2rem",
                transition: ".3s",
                _hover: {
                  color: "red",
                },
              })}
              to={routes.DATABOX(params.directoryId)}
            >
              <FontAwesomeIcon icon={faClose} />
            </Link>
          </div>

          <div
            className={css({
              backgroundColor: "whiteGray",
              height: "1px",
              width: "100%",
              margin: ".75rem 0",
            })}
          />
          <Alert type="error">{actionData?.errors.message}</Alert>

          <input
            type="text"
            name="directory_id"
            value={params.directoryId}
            hidden
          />
          <input type="text" name="id" value={params.id} hidden />
          <InputWithLabel
            defaultValue={loadedFileObject.name}
            label="ファイル名"
            name="name"
            type="text"
          />
        </div>

        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            columnGap: "1rem",
          })}
        >
          <RedButton
            className={css({
              display: "block",
              width: "100%",
            })}
            designType="fill"
            type="submit"
          >
            変更
          </RedButton>
          <Link
            className={css({
              width: "100%",
            })}
            to={routes.DELETE_FILE(params.id!, params.directoryId)}
          >
            <BlueButton
              className={css({
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                columnGap: ".25rem",
              })}
              designType="fill"
              type="button"
            >
              <FontAwesomeIcon icon={faTrash} />
              ファイル削除
            </BlueButton>
          </Link>
        </div>
      </Form>

      {isLoading ? <Loading /> : <></>}
    </Modal>
  );
}
