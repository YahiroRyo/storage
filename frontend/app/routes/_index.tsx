import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { UnauthorizedHeader } from "~/components/organisms/UnauthorizedHeader";
import { routes } from "~/constants/routes";
import { getSession } from "~/modules/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (await session.get("token")) {
    return redirect(routes.DATABOX());
  }
  return json(null);
};

export default function Index() {
  return (
    <>
      <UnauthorizedHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}
