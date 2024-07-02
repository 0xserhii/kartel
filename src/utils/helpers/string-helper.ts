export function adjustStringLength(inputString: string, length: number) {
  if (inputString.length > length) {
    return inputString.substring(0, length);
  }

  return inputString;
}
