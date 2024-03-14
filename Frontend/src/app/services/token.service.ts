import { Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }
  
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  isValidToken() {
    const token = this.getToken()
    if(!token) {
      return false;
    }
    const decodeToken = jwtDecode<JwtPayload>(token)

    if(!decodeToken || !decodeToken?.exp) {
      return false;
    }
    const tokenDate = new Date(0);
    tokenDate.setUTCSeconds(decodeToken.exp);
    const today = new Date();

    return tokenDate.getTime() > today.getTime();
  }
}
