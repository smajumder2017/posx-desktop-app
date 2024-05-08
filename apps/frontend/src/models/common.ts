export interface IResponseError {
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface IAsyncThunkErrorResponse {
  status: number;
  response: IResponseError;
}
