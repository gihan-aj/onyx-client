import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProblemDetails, ValidationProblemDetails } from '../models/error.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor() {}

  /**
   * Parses an HttpErrorResponse to extract a user-friendly error message.
   * It handles standard ProblemDetails, ValidationProblemDetails, and network errors.
   * @param error The HttpErrorResponse to parse.
   * @returns A user-friendly string.
   */
  public parseHttpError(error: HttpErrorResponse): string {
    // Case 1: The backend is down or there's a network issue.
    // The `error.error` will not be a server-generated object.
    if (error.status === 0 || error.error instanceof ProgressEvent) {
      return 'Network error: Could not connect to the server. Please try again later.';
    }

    // Case 2: The backend returned a structured error response (ProblemDetails).
    if (error.error) {
      // Check for ValidationProblemDetails (400) first, as it's more specific.
      const validationError = error.error as ValidationProblemDetails;
      if (validationError.errors) {
        // For a toast, we usually show the main title, not all individual field errors.
        return (
          validationError.title || 'One or more validation errors occurred.'
        );
      }

      // Check for other standard ProblemDetails (401, 404, 500, etc.).
      const problemDetails = error.error as ProblemDetails;
      if (problemDetails.detail) {
        return problemDetails.detail;
      }
      if (problemDetails.title) {
        return problemDetails.title;
      }
    }

    // Case 3: Fallback for other HTTP errors that don't follow the ProblemDetails format.
    if (error.statusText) {
      return `Error: ${error.statusText} (Code: ${error.status})`;
    }

    // Ultimate fallback.
    return 'An unexpected error occurred.';
  }
}
