import { Injectable, inject, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService)

  username: string = '';
  user$ = signal<User | null>(null);

  apiUrl: string = environment.API_URL;

  getProfile(username: string) {
    const token = this.tokenService.getToken();
    return this.http.get<User>(`${this.apiUrl}/api/users/profile/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(tap(user => this.user$.update(() => user)));
  }
}
