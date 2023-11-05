import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { redirect, type ActionFunction, json } from "@remix-run/node";
import { Form, Link, useActionData, useParams } from "@remix-run/react";
import type { ErrorRes } from "api/@types";
import axios from "axios";
import { useState } from "react";
import { css } from "styled-system/css";
import { Alert } from "~/components/atoms/Alert";
import { RedButton } from "~/components/atoms/Button/redButton";
import { InputWithLabel } from "~/components/molecules/InputWithLabel";
import { Loading } from "~/components/molecules/Loading";
import { Modal } from "~/components/molecules/Modal";
import { routes } from "~/constants/routes";
import { apiClient } from "~/modules/api";
import { getSession } from "~/modules/sessions";

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

  const formData = await request.formData();

  const name = formData.get("name");
  const directoryId = formData.get("directory_id");

  const errorRes: Errors = { errors: {} };

  if (!name) {
    errorRes.errors.message = "名前は必須項目です。";
    return json(errorRes);
  }

  try {
    await apiClient(session.get("token")).directory.$post({
      body: {
        directory_id: directoryId?.toString(),
        name: name.toString(),
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
  const actionData = useActionData<Errors>();

  const onSubmit = () => {
    setIsLoading(true);
  };

  return (
    <Modal
      className={css({
        width: "90vw",
        height: "90vh",
        padding: "2rem",
        md: {
          width: "50vw",
          height: "30vh",
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
              ディレクトリ作成
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
          <InputWithLabel label="ディレクトリ名" name="name" type="text" />
        </div>

        <RedButton
          className={css({
            display: "block",
          })}
          designType="fill"
          type="submit"
        >
          ディレクトリ作成
        </RedButton>
      </Form>

      {isLoading ? <Loading /> : <></>}
    </Modal>
  );
}
