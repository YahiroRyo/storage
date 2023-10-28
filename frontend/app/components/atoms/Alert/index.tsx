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
          color: "gray",
          fontWeight: "bold",
          padding: "1rem",
          borderRadius: "4px",
          border: "1px",
          borderColor: "error",
        })}
      >
        {children}
      </div>
    );
  }

  throw Error("invalid alert type.");
};
