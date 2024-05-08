import { AxiosError } from 'axios';

export function getApiError(error: unknown): {
  message: string;
  statusCode: number;
} {
  if (error instanceof AxiosError) {
    return error.response?.data;
  }
  if (error instanceof Error)
    return { message: error.message, statusCode: 500 };

  return { message: 'Something went wrong', statusCode: 500 };
}
