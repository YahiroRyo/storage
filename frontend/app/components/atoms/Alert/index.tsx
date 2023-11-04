import { css } from "styled-system/css";

type Props = {
  children?: React.ReactNode;
  type: "error";
};

export const Alert = ({ children, type }: Props) => {
  if (!children) {
    return <></>;
  }

  if (type === "error") {
    return (
      <div
        className={css({
          color: "red",
          fontWeight: "bold",
          padding: "1.25rem 1rem",
          borderRadius: "4px",
          border: "1px solid var(--colors-red)",
          backgroundColor: "rose.100",
          letterSpacing: "1px",
        })}
      >
        {children}
      </div>
    );
  }

  throw Error("invalid alert type.");
};
