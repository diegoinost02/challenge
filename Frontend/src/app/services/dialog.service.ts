import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoteFormComponent } from '../components/layout/components/note-form/note-form.component';
import { CategoryFormComponent } from '../components/layout/components/category-form/category-form.component';
import { EditNoteComponent } from '../components/layout/components/edit-note/edit-note.component';
import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = inject(MatDialog);

  openNoteForm() {
    this.dialog.open(NoteFormComponent, {
      height: 'auto', width: 'auto',
      // backdropClass: "background-dialog",
    });
  }

  openCategoryForm() {
    this.dialog.open(CategoryFormComponent, {
      height: 'auto', width: 'auto',
    //   // backdropClass: "background-dialog",
    });
  }

  openEditNote(note: Note) {
    this.dialog.open(EditNoteComponent, {
      height: 'auto', width: 'auto',
      data: note,
      //   // backdropClass: "background-dialog",
    })
  }

}
