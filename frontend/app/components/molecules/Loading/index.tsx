import { css } from "styled-system/css";
import { multipleClassName } from "~/modules/mutipleClassName";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const Loading = ({ children, className }: Props) => {
  return (
    <div
      className={multipleClassName(
        css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "rgba(51, 51, 51, .5)",
          zIndex: 2,
        }),
        className
      )}
    >
      <div
        className={css({
          width: "3.5rem",
          height: "3.5rem",
          border: "5px solid #FFF",
          borderBottomColor: "transparent",
          borderRadius: "50%",
          display: "inline-block",
          boxSizing: "border-box",
          animation: "rotation 1s linear infinite",
        })}
      />
      {children}
    </div>
  );
};
