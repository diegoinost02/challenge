import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../environments/environments';
import { CreateNoteDto, Note } from '../interfaces/note';
import { TokenService } from './token.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService)

  notes$ = signal<Note[]>([]);

  apiUrl: string = environment.API_URL;

    createNote (note: CreateNoteDto) {
      const token = this.tokenService.getToken();
      return this.http.post<Note>(`${this.apiUrl}/api/notes/create`, note, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    updateNote(note: Note) {
      const token = this.tokenService.getToken();
      return this.http.put<Note>(`${this.apiUrl}/api/notes/update/${note.id}`, note, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    deleteNote (id: number) {
      const token = this.tokenService.getToken();
      return this.http.delete(`${this.apiUrl}/api/notes/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    listByUserId(userId: number) {
      const token = this.tokenService.getToken();
      return this.http.get<Note[]>(`${this.apiUrl}/api/notes/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    listArchiveByUserId(userId: number) {
      const token = this.tokenService.getToken();
      return this.http.get<Note[]>(`${this.apiUrl}/api/notes/user/${userId}/archive`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    listByUserIdAndCategory(userId: number, categoryId: number) {
      const token = this.tokenService.getToken();
      return this.http.get<Note[]>(`${this.apiUrl}/api/notes/user/${userId}/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
}