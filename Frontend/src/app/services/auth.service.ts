import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environments';
import { ResponseLogin } from '../interfaces/response-model';
import { User } from '../interfaces/user';
import { switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService)

  apiUrl: string = environment.API_URL;

  login(username: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiUrl}/login`, { username, password })
    .pipe(tap(response =>{
      this.tokenService.saveToken(response.token)
    }))
  }

  register(username: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/api/users/register`, { username, password })
  }

  registerAndLogin(username: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/users/register`, { username, password })
    .pipe(switchMap(() => this.login(username, password)));
  }
}
