export type ActionResponse<TField extends string = string> =
  | { status: "success"; message?: string }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<TField, string>> };

export const optionalTrimmed = (value: string | undefined | null) => {
  if (value === undefined || value === null) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};
