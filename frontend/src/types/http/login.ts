export type APIErrorDetails = {
  login?: string | string[];
  email?: string | string[];
  password?: string | string[];
  [key: string]: unknown;
};

export type LoginFieldErrors = {
    login: string[];
    password: string[];
};

export type LaravelErrorResponse = {
  message?: string;
  errors?: APIErrorDetails;
  error?: {
    message?: string;
    details?: APIErrorDetails;
  };
};

export type HandleLoginResponse = {
  code: number;
  response: LaravelErrorResponse | unknown;
};