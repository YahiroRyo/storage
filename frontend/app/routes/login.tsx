import { json, type ActionFunction, type MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { css } from "styled-system/css";
import { BlueButton } from "~/components/atoms/Button/blueButton";
import { InputWithLabel } from "~/components/molecules/InputWithLabel";
import { Header } from "~/components/organisms/Header";
import { routes } from "~/constants/routes";
import { apiClient } from "~/modules/api";

export const meta: MetaFunction = () => {
  return [
    { title: "ログイン" },
    { name: "description", content: "ログインを行います" },
  ];
};

type Errors = {
  errors: {
    email?: string;
    username?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  const errorRes: Errors = { errors: {} };
  if (!username) {
    errorRes.errors.username = "ユーザー名は必須項目です";
  }
  if (!email) {
    errorRes.errors.email = "メールアドレスは必須項目です";
  }
  if (!password) {
    errorRes.errors.password = "メールアドレスは必須項目です";
  }

  if (
    errorRes.errors.username ||
    errorRes.errors.email ||
    errorRes.errors.password
  ) {
    return json(errorRes);
  }

  apiClient().user.$post({
    body: {
      username: username!.toString(),
      email: email!.toString(),
      password: password!.toString(),
    },
  });
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
          <InputWithLabel
            error={actionData?.errors.email}
            label="メールアドレス"
            type="email"
            name="email"
          />
          <InputWithLabel
            error={actionData?.errors.username}
            label="ユーザー名"
            type="text"
            name="username"
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
