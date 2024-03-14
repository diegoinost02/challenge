import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RequestStatus } from '../../../interfaces/request-status';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  registerForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  status: RequestStatus = 'init';
  hidePassword: boolean = true;

  register(): void{
    if (this.registerForm.valid) {
      this.status = 'loading'
      const { username, password } = this.registerForm.getRawValue();
      this.authService.registerAndLogin(username, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () =>{
          this.status = 'success';
          this.userService.username = username;
          this.router.navigate(['/app']);
        },
        error: () => {
          this.status = 'failed';
          this.openSnackBar('Register failed', 'Close');
        }}
      )
    } else {
      this.registerForm.markAllAsTouched();
      this.openSnackBar('Register failed', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

}
