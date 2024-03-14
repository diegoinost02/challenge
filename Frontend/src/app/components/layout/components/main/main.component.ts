import { Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CategoryService } from '../../../../services/category.service';
import { NotesService } from '../../../../services/notes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { OverlayModule } from '@angular/cdk/overlay';
import { Category } from '../../../../interfaces/category';
import { Note } from '../../../../interfaces/note';
import { DialogService } from '../../../../services/dialog.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, OverlayModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {

  private userService = inject(UserService);
  private categoryService = inject(CategoryService);
  private noteService = inject(NotesService);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DialogService);

  constructor() {
    effect(()=>{
      this.getNotes();
      this.getCategories();
    })
  }

  user$ = this.userService.user$;
  categories$ = this.categoryService.categories$;
  notes$ = this.noteService.notes$;

  noteToOpenOverlay: Number = -1;

  openNoteOverlay(noteId: number) {
    this.noteToOpenOverlay = noteId;
  }

  containsCategory(note: Note, category: Category) {
    if(note.categories.some(cat => cat.id === category.id)) {
      return true;
    } else {
      return false;
    }
  }

  getCategories(): void {
    if (!this.userService.user$()) return;
    this.categoryService.getByUserId(this.userService.user$()!.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(
      {
        next: (categories) => {
          this.categoryService.categories$.update(() => categories.slice().reverse());
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }

  getNotes() {
    if (!this.userService.user$()) return;
    this.noteService.listByUserId(this.userService.user$()!.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(
      {
        next: (notes: Note[]) => {
          this.noteService.notes$.update(() => notes.slice().reverse());
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }

  removeCategory(note: Note, category: Category) {
    note.categories = note.categories.filter(cat => cat.id !== category.id);
    this.updateNote(note);
  }

  addCategory(note: Note, category: Category) {
    note.categories.push(category);
    this.updateNote(note);
  }

  updateNote(note: Note) {
    this.noteService.updateNote(note).subscribe();
  }

  editNote(note: Note){
    this.dialogService.openEditNote(note);
  }

  categoryFilter(category: Category) {
    if (!this.userService.user$()) return;
    this.noteService.listByUserIdAndCategory(this.user$()!.id,category.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(
      {
        next: (notes: Note[]) => {
          this.noteService.notes$.update(() => notes.slice().reverse());
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }
}
