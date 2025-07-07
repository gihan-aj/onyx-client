import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

// The expected response from the login API
export interface AuthResponse {
  userId: string;
  email: string;
  userCode: string;
  token: string;
  tokenExpiryUtc: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrls.auth;

  login(
    email: string,
    password: string,
    deviceId: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password,
      deviceId,
    });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/refresh-token`,
      {},
      { withCredentials: true } // This tells the browser to send cookies
    );
  }

  register(payLoad: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, payLoad);
  }

  resendActivation(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/resend-activation`, { email });
  }

  activateAccount(token: string, email: string): Observable<void> {
    const url = `${this.apiUrl}/activate`;
    const options = {
      params: {
        token: token,
        email: email,
      },
    };
    return this.http.get<void>(url, options);
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/request-password-reset`, {
      email,
    });
  }

  resetPassword(payload: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, payload);
  }
}
