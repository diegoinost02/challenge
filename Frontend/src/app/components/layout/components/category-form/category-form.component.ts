import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { RequestStatus } from '../../../../interfaces/request-status';
import { Category, CreateCategoryDto } from '../../../../interfaces/category';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {

  private categoryService = inject(CategoryService);
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(DialogRef);

  user$ = this.userService.user$;

  categoryForm = this.formBuilder.nonNullable.group({
    description: ['', [Validators.required]],
  })

  statusCreateCategory: RequestStatus = 'init'

  createCategory(): void {
    if(this.categoryForm.valid) {
      this.statusCreateCategory = 'loading';
      const {description} = this.categoryForm.getRawValue();

      const category: CreateCategoryDto = {
        name: description,
        user: this.user$()!,
      };
      
      this.categoryService.createCategory(category)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ 
        next: (category: Category) => {
          this.categoryService.categories$.update((categories) => { 
            categories.unshift(category);
            return categories
          })
          this.dialogRef.close();
          this.statusCreateCategory = 'success';
        },
        error: () => {
          this.statusCreateCategory = 'failed';
        }
      })
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
