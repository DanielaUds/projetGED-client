import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { config } from './../../config';
import { Tokens } from '../models/tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USER_INFOS = 'USER_INFOS';
  private loggedUser: string;

  constructor(private http: HttpClient) {}

  login(user: { login: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${config.apiUrl}/auth/token`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.login, tokens)),
        mapTo(true),
        catchError(error => {
          console.log(error.error);
          return of(false);
        }));
  }

  logout() {
    this.doLogoutUser();
    return of(true);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(`${config.apiUrl}/refresh`, {
      token: this.getRefreshToken()
    }).pipe(tap((tokens: any) => {
      this.storeJwtToken(tokens.token);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(login: string, tokens: any) {
    this.loggedUser = login;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  public getUserInfos() {
    return JSON.parse(localStorage.getItem(this.USER_INFOS));
  }

  public storeUserInfos(user: any) {
    localStorage.setItem(this.USER_INFOS, JSON.stringify(user));
  }

  private storeJwtToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  private storeTokens(tokens: any) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(this.USER_INFOS, JSON.stringify(tokens.user));
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USER_INFOS);
  }
}
