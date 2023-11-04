import { css } from "styled-system/css";
import { multipleClassName } from "~/modules/mutipleClassName";

type Props = {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  designType: DesignType;
  type?: ButtonType;
};

export const RedButton = ({
  children,
  className,
  disabled,
  designType,
  type,
}: Props) => {
  if (designType === "outline") {
    return (
      <button
        disabled={disabled}
        type={type}
        className={multipleClassName(
          css({
            padding: "1rem 1.25rem",
            border: "1px solid var(--colors-red)",
            color: "red",
            cursor: "pointer",
            borderRadius: "4px",
            transition: ".3s",
            _hover: {
              backgroundColor: "red",
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
  if (designType === "fill") {
    return (
      <button
        disabled={disabled}
        type={type}
        className={multipleClassName(
          css({
            padding: "1rem",
            border: "1px solid var(--colors-red)",
            backgroundColor: "red",
            color: "white",
            cursor: "pointer",
            borderRadius: "4px",
            transition: ".3s",
            fontWeight: "bold",
            _hover: {
              backgroundColor: "white",
              color: "red",
            },
          }),
          className
        )}
      >
        {children}
      </button>
    );
  }

  throw new Error("invalid button type.");
};
