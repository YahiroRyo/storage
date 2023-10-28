import { Link } from "@remix-run/react";
import { css } from "styled-system/css";
import { BlueButton } from "~/components/atoms/Button/blueButton";
import { RedButton } from "~/components/atoms/Button/redButton";
import { Logo } from "~/components/atoms/Logo";
import { routes } from "~/constants/routes";

export const Header = () => {
  return (
    <header
      className={css({
        backgroundColor: "white",
        boxShadow: "4px 0 4px rgba(51, 51, 51, .3)",
        padding: ".75rem 1rem",
      })}
    >
      <div
        className={css({
          width: "95%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <Logo />

        <nav>
          <ul
            className={css({
              display: "flex",
              alignItems: "center",
              columnGap: "1rem",
            })}
          >
            <li>
              <Link to={routes.REGISTER}>
                <RedButton type="outline">登録</RedButton>
              </Link>
            </li>
            <li>
              <Link to={routes.LOGIN}>
                <BlueButton type="outline">ログイン</BlueButton>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
