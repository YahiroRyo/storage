import { css } from "styled-system/css";
import { multipleClassName } from "~/modules/mutipleClassName";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const Modal = ({ children, className }: Props) => {
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(51, 51, 51, .5)",
        zIndex: 1,
      })}
    >
      <div
        className={multipleClassName(
          css({
            borderRadius: "8px",
            boxShadow: "4px 4px 32px rgba(51, 51, 51, .25)",
            backgroundColor: "white",
          }),
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
