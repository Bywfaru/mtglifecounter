/**
 * Generates a 6-character alphanumeric code in XXXXXX format
 * @returns A 6-character alphanumeric code in XXXXXX format
 */
export const generatePodCode = (): string => {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  return code;
};
