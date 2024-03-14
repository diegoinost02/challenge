import { Component, DestroyRef, inject } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RequestStatus } from '../../../../interfaces/request-status';
import { CreateNoteDto, Note } from '../../../../interfaces/note';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css'
})
export class NoteFormComponent {

  private noteService = inject(NotesService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef);

  private userService = inject(UserService);

  user$ = this.userService.user$;

  noteForm = this.formBuilder.nonNullable.group({
    description: ['', [Validators.required]],
  })

  statusCreateNote: RequestStatus = 'init'

  createNote(): void {
    if(this.noteForm.valid) {
      this.statusCreateNote = 'loading';
      const {description} = this.noteForm.getRawValue();

      const note: CreateNoteDto = {
        user: this.user$()!, // to do: get user id from service
        description: description,
        enabled: true
      };
      
      this.noteService.createNote(note)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ 
        next: (note: Note) => {
          this.noteService.notes$.update((notes) => { 
            notes.unshift(note);
            return notes
          })
          this.dialogRef.close();
          this.statusCreateNote = 'success';
        },
        error: (err) => {
          console.log(err);
          this.statusCreateNote = 'failed';
        }
      })
    } else {
      this.noteForm.markAllAsTouched();
    }
  }

}
