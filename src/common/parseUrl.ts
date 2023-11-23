export const urlSearchToParams = (search: string): any => {
  const data = search.substring(1);
  const params = new URLSearchParams(data);
  return Object.fromEntries(params);
};

export const paramsToUrlSearch = (obj: any): string => {
  return new URLSearchParams(obj).toString();
};
