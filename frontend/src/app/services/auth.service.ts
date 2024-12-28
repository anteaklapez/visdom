import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserLogin } from '../models/user-login.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  loggedIn$ = this._loggedIn.asObservable();

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(username: string, password: string): Observable<UserLogin> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this._http.post<UserLogin>(
      `${environment.apiUrl}/token`,
      body.toString(),
      { headers }
    );
  }

  setLoggedIn(status: boolean): void {
    this._loggedIn.next(status);
  }
}
