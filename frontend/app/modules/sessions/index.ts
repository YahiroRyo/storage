import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  token: string;
};

type SessionFlashData = {
  error: string;
};

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "token",
      domain: "localhost",
      httpOnly: true,
      maxAge: 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secrets: ["__D4T4_B0x_ExPrESs__"],
      secure: true,
    },
  });
