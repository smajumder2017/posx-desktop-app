import { SetURLSearchParams, useSearchParams } from 'react-router-dom';

export const useQueryParams = (): [
  { [key: string]: string },
  SetURLSearchParams,
] => {
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));
  return [searchAsObject, setSearch];
};
