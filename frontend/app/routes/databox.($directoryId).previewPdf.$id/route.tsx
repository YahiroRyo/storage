import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import type { ErrorRes, FileObject } from "api/@types";
import axios from "axios";
import { css } from "styled-system/css";
import { Alert } from "~/components/atoms/Alert";
import { Modal } from "~/components/molecules/Modal";
import { routes } from "~/constants/routes";
import { apiClient } from "~/modules/api";
import { destroySession, getSession } from "~/modules/sessions";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

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

export default function Index() {
  const params = useParams();
  const data = useLoaderData<typeof loader>();

  if ("errors" in data && "message" in data.errors) {
    return (
      <>
        <Alert type="error">{data.errors.message}</Alert>
        <Outlet />
      </>
    );
  }

  const fileObject = data as FileObject;

  return (
    <Modal
      className={css({
        width: "95vw",
        height: "95vh",
        padding: "2rem",
        backgroundColor: "rgba(51, 51, 51, .3) !important",
      })}
    >
      <div
        className={css({
          position: "fixed",
          padding: ".25rem 1rem",
          backgroundColor: "rgba(51, 51, 51, .75)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          columnGap: "1rem",
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1
        })}
      >
        <p>{fileObject.name}</p>
        <Link
          className={css({
            cursor: "pointer",
            fontSize: "2rem",
            transition: ".3s",
          })}
          to={routes.DATABOX(params.directoryId)}
        >
          <FontAwesomeIcon icon={faClose} />
        </Link>
      </div>

      <div className={css({
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto'
      })}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileObject.url}
          />
        </Worker>
      </div>
    </Modal>
  );
}
