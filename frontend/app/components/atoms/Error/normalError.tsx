import { css } from "styled-system/css";
import { multipleClassName } from "~/modules/mutipleClassName";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const NormalError = ({ children, className }: Props) => {
  return (
    <p
      className={multipleClassName(
        css({
          fontWeight: "bold",
          fontSize: "1rem",
          color: "error",
        }),
        className
      )}
    >
      {children}
    </p>
  );
};
