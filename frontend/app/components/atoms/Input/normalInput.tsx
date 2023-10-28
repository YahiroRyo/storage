import { css } from "styled-system/css";

type Props = {
  name: string;
  type: string;
};

export const NormalInput = ({ name, type }: Props) => {
  return (
    <input
      className={css({
        border: "1px solid var(--colors-white-gray)",
        borderRadius: "4px",
        padding: ".5rem .75rem",
        outline: "0",
        transition: ".1s",
        _focus: {
          border: "1px solid transparent",
          boxShadow: "0 0 4px var(--colors-blue)",
        },
      })}
      name={name}
      type={type}
    />
  );
};
