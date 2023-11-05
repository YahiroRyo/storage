import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  json,
  type ActionFunction,
  redirect,
  unstable_parseMultipartFormData,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { Form, Link, useActionData, useParams } from "@remix-run/react";
import type { ErrorRes } from "api/@types";
import axios from "axios";
import type { RefObject } from "react";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { css } from "styled-system/css";
import { RedButton } from "~/components/atoms/Button/redButton";
import { Loading } from "~/components/molecules/Loading";
import { Modal } from "~/components/molecules/Modal";
import { routes } from "~/constants/routes";
import { apiClient } from "~/modules/api";
import { getSession } from "~/modules/sessions";
import { Alert } from "~/components/atoms/Alert";
import { S3 } from "~/modules/storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { useDropzone } from "react-dropzone";

type Errors = {
  errors: {
    message?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    return redirect(routes.ROOT());
  }

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 300_000_000_000_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const files = formData.getAll("files[]");
  const directoryId = formData.get("directory_id");

  const errorRes: Errors = { errors: {} };

  if (!files) {
    errorRes.errors.message = "ファイルは必須項目です。";
    return json(errorRes);
  }
  if (!(files instanceof Array && files[0] instanceof Blob)) {
    errorRes.errors.message = "ファイルではないです。";
    return json(errorRes);
  }

  try {
    for (const file of files as File[]) {
      const key = randomUUID();

      await S3().send(
        new PutObjectCommand({
          Body: (await file.arrayBuffer()) as Buffer,
          Bucket: process.env.CF_BUCKET,
          Key: key,
          ContentType: file.type,
        })
      );

      await apiClient(session.get("token")).file.$post({
        body: {
          url: `https://pub-66e0c49d80ce442da586f792084cc37d.r2.dev/${key}`,
          directory_id: directoryId?.toString(),
          mimetype: file.type,
          filename: file.name,
        },
      });
    }

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
  const actionData = useActionData<Errors>();
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<RefObject<HTMLInputElement>>>([]);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    acceptedFiles.forEach((_, index) => {
      inputRefs.current[index] = createRef<HTMLInputElement>();
    });
  }, []);
  const { getRootProps, acceptedFiles } = useDropzone({ onDrop });

  useEffect(() => {
    setIsLoading(false);
  }, [actionData]);

  const onSubmit = async () => {
    setIsLoading(true);
    acceptedFiles.forEach((acceptedFile, index) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(acceptedFile);
      inputRefs.current[index].current!.files = dataTransfer.files;
    });
  };

  return (
    <Modal
      className={css({
        width: "50vw",
        height: "50vh",
        padding: "2rem",
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
        encType="multipart/form-data"
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
              ファイルアップロード
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

          {acceptedFiles.length ? (
            <div>
              {acceptedFiles.map((acceptedFile, index) => (
                <div key={index}>
                  <p>{acceptedFile.name}</p>
                  <input
                    ref={inputRefs.current[index]}
                    type="file"
                    name="files[]"
                    hidden
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={css({
                borderRadius: "8px",
                border: "1px solid var(--colors-blue)",
                padding: "1rem",
                height: "15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: ".1s",
                _hover: {
                  backgroundColor: "darkWhite",
                },
              })}
            >
              <p
                className={css({
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  color: "gray",
                })}
              >
                ファイルをドロップするか、選択してください
              </p>
            </div>
          )}
        </div>

        <RedButton
          className={css({
            display: "block",
          })}
          designType="fill"
          type="submit"
        >
          ファイルアップロード
        </RedButton>
      </Form>

      {isLoading ? <Loading /> : <></>}
    </Modal>
  );
}
