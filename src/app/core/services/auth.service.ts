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
}
