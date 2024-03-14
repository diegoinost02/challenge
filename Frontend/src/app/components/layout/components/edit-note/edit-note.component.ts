import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NotesService } from '../../../../services/notes.service';
import { Note } from '../../../../interfaces/note';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-note',
  standalone: true,
  imports: [MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-note.component.html',
  styleUrl: './edit-note.component.css'
})
export class EditNoteComponent {

  private noteService = inject(NotesService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef);

  protected noteData: Note = inject(MAT_DIALOG_DATA);

  noteForm = this.formBuilder.nonNullable.group({
    description: [this.noteData.description, [Validators.required]],
  })

  editNote(){
    if(this.noteForm.valid) {
      const {description} = this.noteForm.getRawValue();
      const note: Note = {
        id: this.noteData.id,
        user: this.noteData.user,
        description: description,
        enabled: this.noteData.enabled,
        categories: this.noteData.categories
      }

      this.updateNote(note)
    }
  }

  archiveNote() {
    const note: Note = {
      id: this.noteData.id,
      user: this.noteData.user,
      description: this.noteData.description,
      enabled: false,
      categories: this.noteData.categories
    }
    this.updateNote(note);
  }

  unarchiveNote() {
    const note: Note = {
      id: this.noteData.id,
      user: this.noteData.user,
      description: this.noteData.description,
      enabled: true,
      categories: this.noteData.categories
    }
    this.updateNote(note);
  }

  updateNote(note: Note) {
      this.noteService.updateNote(note)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (note) => {
          this.noteService.notes$.update((notes) => {
            const index = notes.findIndex(n => n.id === note.id);

            if(note.enabled === false || this.noteData.enabled === false) {
              notes.splice(index, 1);
              return notes;
            } else {
              notes[index] = note;
              return notes;
            }
          })
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  

  deleteNote() {
    this.noteService.deleteNote(this.noteData.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.noteService.notes$.update((notes) => {
          const index = notes.findIndex(n => n.id === this.noteData.id);
          notes.splice(index, 1);
          return notes;
        })
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
