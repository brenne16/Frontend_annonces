import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.api}/auth/login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}