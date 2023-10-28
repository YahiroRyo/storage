import { css } from "styled-system/css";
import { multipleClassName } from "~/modules/mutipleClassName";

type Props = {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type: Type;
};

export const BlueButton = ({ children, className, disabled, type }: Props) => {
  if (type === "outline") {
    return (
      <button
        disabled={disabled}
        className={multipleClassName(
          css({
            padding: "1rem",
            border: "1px solid var(--colors-blue)",
            color: "blue",
            cursor: "pointer",
            borderRadius: "4px",
            transition: ".3s",
            _hover: {
              backgroundColor: "blue",
              fontWeight: "bold",
              color: "white",
            },
          }),
          className
        )}
      >
        {children}
      </button>
    );
  }
  if (type === "fill") {
    return (
      <button
        disabled={disabled}
        className={multipleClassName(
          css({
            padding: "1rem",
            border: "1px solid var(--colors-blue)",
            backgroundColor: "blue",
            color: "white",
            cursor: "pointer",
            borderRadius: "4px",
            transition: ".3s",
            fontWeight: "bold",
            _hover: {
              backgroundColor: "whiteBlue",
            },
          }),
          className
        )}
      >
        {children}
      </button>
    );
  }

  throw new Error("invalid type.");
};
