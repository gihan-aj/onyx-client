/**
 * Matches the structure of a standard ValidationProblemDetails response (RFC 7807).
 * Backend sends this for 400 Validation errors.
 */
export interface ValidationProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors: { [key: string]: string[] };
}

/**
 * Matches the structure for standard problem details (401, 404, 500, etc.).
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errorCode?: string;
}
