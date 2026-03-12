import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  userId: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(userId: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { userId, password, role }).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('ss_token', res.token);
          localStorage.setItem('ss_user', JSON.stringify(res.user));
          this.userSubject.next(res.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    this.userSubject.next(null);
    this.router.navigate(['/splash']);
  }

  getToken(): string | null {
    return localStorage.getItem('ss_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem('ss_user');
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }
}
