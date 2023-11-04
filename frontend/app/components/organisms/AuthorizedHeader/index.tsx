import { css } from "styled-system/css";
import { Logo } from "~/components/atoms/Logo";

export const AuthorizedHeader = () => {
  return (
    <header
      className={css({
        backgroundColor: "white",
        boxShadow: "4px 0 4px rgba(51, 51, 51, .3)",
      })}
    >
      <div
        className={css({
          width: "95%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "5rem",
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
          ></ul>
        </nav>
      </div>
    </header>
  );
};
