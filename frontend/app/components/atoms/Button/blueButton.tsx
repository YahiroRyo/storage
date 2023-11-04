import { css } from "styled-system/css";
import { multipleClassName } from "~/modules/mutipleClassName";

type Props = {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  designType: DesignType;
  type?: ButtonType;
};

export const BlueButton = ({
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
  if (designType === "fill") {
    return (
      <button
        disabled={disabled}
        type={type}
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

  throw new Error("invalid button type.");
};
