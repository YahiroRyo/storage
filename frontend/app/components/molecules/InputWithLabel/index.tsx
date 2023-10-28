import { css } from "styled-system/css";
import { NormalError } from "~/components/atoms/Error/normalError";
import { NormalInput } from "~/components/atoms/Input/normalInput";
import { DarkGrayLabel } from "~/components/atoms/Label/darkGrayLabel";

type Props = {
  label: string;
  name: string;
  type: string;
  error?: string;
};

export const InputWithLabel = ({ label, name, type, error }: Props) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        rowGap: ".5rem",
      })}
    >
      <DarkGrayLabel>{label}</DarkGrayLabel>
      <NormalInput name={name} type={type} />
      {error ? <NormalError>{error}</NormalError> : <></>}
    </div>
  );
};
