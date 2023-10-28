export const multipleClassName = (
  ...classNames: (string | undefined)[]
): string => {
  let result = "";
  classNames.forEach((className) => {
    if (className) {
      result += className + " ";
    }
  });
  return result;
};
