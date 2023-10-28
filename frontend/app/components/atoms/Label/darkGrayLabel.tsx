import { css } from "styled-system/css";

type Props = {
  children?: React.ReactNode;
  htmlFor?: string;
};

export const DarkGrayLabel = ({ children, htmlFor }: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className={css({
        color: "darkGray",
        fontWeight: "bold",
      })}
    >
      {children}
    </label>
  );
};
