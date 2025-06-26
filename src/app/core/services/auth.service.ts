import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// The expected response from the login API
export interface AuthResponse {
  userId: string;
  email: string;
  userCode: string;
  token: string;
  tokenExpieryUtc: string; // Changed from tokenExpieryUtc to match your casing
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7026/api/v1/users';

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

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {
      refreshToken: token,
    });
  }
}
