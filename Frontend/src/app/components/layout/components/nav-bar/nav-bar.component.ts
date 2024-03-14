import { Component, DestroyRef, inject } from '@angular/core';
import { DialogService } from '../../../../services/dialog.service';
import { UserService } from '../../../../services/user.service';
import { NotesService } from '../../../../services/notes.service';
import { Note } from '../../../../interfaces/note';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  listArchivedNotes: boolean = false;

  private userService = inject(UserService);
  private noteService = inject(NotesService);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  openNoteForm(): void {
    this.dialogService.openNoteForm();
  }

  openCategoryForm(): void {
    this.dialogService.openCategoryForm();
  }

  getArchivedNotes() {
    if (!this.userService.user$()) return;
    this.noteService.listArchiveByUserId(this.userService.user$()!.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(
      {
        next: (notes: Note[]) => {
          this.noteService.notes$.update(() => notes.slice().reverse());
          this.listArchivedNotes = true;
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }
  getNotes() {
    if (!this.userService.user$()) return;
    this.noteService.listByUserId(this.userService.user$()!.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(
      {
        next: (notes: Note[]) => {
          this.noteService.notes$.update(() => notes.slice().reverse());
          this.listArchivedNotes = false;
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }
}
