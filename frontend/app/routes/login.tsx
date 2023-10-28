import {
  json,
  type ActionFunction,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { ErrorRes } from "api/@types";
import axios from "axios";
import { css } from "styled-system/css";
import { Alert } from "~/components/atoms/Alert";
import { BlueButton } from "~/components/atoms/Button/blueButton";
import { InputWithLabel } from "~/components/molecules/InputWithLabel";
import { Header } from "~/components/organisms/Header";
import { routes } from "~/constants/routes";
import { apiClient } from "~/modules/api";
import { commitSession, getSession } from "~/modules/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "ログイン" },
    { name: "description", content: "ログインを行います" },
  ];
};

type Errors = {
  errors: {
    email?: string;
    password?: string;
    message?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const errorRes: Errors = { errors: {} };
  if (!email) {
    errorRes.errors.email = "メールアドレスは必須項目です";
  }
  if (!password) {
    errorRes.errors.password = "メールアドレスは必須項目です";
  }

  if (errorRes.errors.email || errorRes.errors.password) {
    return json(errorRes);
  }

  try {
    const res = await (
      await apiClient()
    ).user.login.$post({
      body: {
        email: email!.toString(),
        password: password!.toString(),
      },
    });

    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", res.token);

    return redirect("/databox", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 401) {
        return json({
          errors: {
            message:
              "ログインに失敗しました。メールアドレスとパスワードを確認の上もう一度お試しください。",
          },
        });
      }

      const errorRes = e.response?.data as ErrorRes;
      if ("message" in errorRes) {
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
  const actionData = useActionData<Errors>();

  return (
    <>
      <Header />
      <main>
        <Form
          className={css({
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
            width: "50%",
            margin: "4rem auto",
          })}
          action={routes.LOGIN}
          method="POST"
        >
          <Alert type="error">{actionData?.errors.message}</Alert>
          <InputWithLabel
            error={actionData?.errors.email}
            label="メールアドレス"
            type="email"
            name="email"
          />
          <InputWithLabel
            error={actionData?.errors.password}
            label="パスワード"
            type="password"
            name="password"
          />
          <BlueButton
            className={css({
              marginTop: "2rem",
            })}
            type="fill"
          >
            登録
          </BlueButton>
        </Form>
      </main>
    </>
  );
}
