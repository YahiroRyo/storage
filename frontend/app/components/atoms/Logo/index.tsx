import { Link } from "@remix-run/react";
import { css } from "styled-system/css";
import { routes } from "~/constants/routes";

export const Logo = () => {
  return (
    <Link
      className={css({
        color: "whiteGray",
        fontSize: "2rem",
        fontWeight: "bold",
        fontStyle: "italic",
        letterSpacing: "-3px",
      })}
      to={routes.ROOT}
    >
      DataBox Express
    </Link>
  );
};
