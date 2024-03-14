import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from '../environments/environments';
import { Category, CreateCategoryDto } from '../interfaces/category';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  categories$ = signal<Category[]>([]);

  apiUrl: string = environment.API_URL;

  getByUserId(userId: number) {
    const token = this.tokenService.getToken();
    return this.http.get<Category[]>(`${this.apiUrl}/api/categories/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(tap(categories => this.categories$.update(() => categories.slice().reverse())));
  }

  createCategory (category: CreateCategoryDto) {
    const token = this.tokenService.getToken();
    return this.http.post<Category>(`${this.apiUrl}/api/categories/create`, category, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
