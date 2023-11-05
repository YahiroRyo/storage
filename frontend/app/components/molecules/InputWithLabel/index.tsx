import { css } from "styled-system/css";
import { NormalError } from "~/components/atoms/Error/normalError";
import { NormalInput } from "~/components/atoms/Input/normalInput";
import { DarkGrayLabel } from "~/components/atoms/Label/darkGrayLabel";

type Props = {
  label: string;
  name: string;
  type: string;
  error?: string;
  defaultValue?: string;
};

export const InputWithLabel = ({
  label,
  name,
  type,
  defaultValue,
  error,
}: Props) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        rowGap: ".25rem",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          rowGap: ".5rem",
        })}
      >
        <DarkGrayLabel>{label}</DarkGrayLabel>
        <NormalInput defaultValue={defaultValue} name={name} type={type} />
      </div>
      {error ? <NormalError>{error}</NormalError> : <></>}
    </div>
  );
};
