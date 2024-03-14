import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RequestStatus } from '../../../interfaces/request-status';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule} from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  private userService = inject(UserService);

  loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  status: RequestStatus = 'init';
  hidePassword: boolean = true;

  login(): void{
    if (this.loginForm.valid) {
      this.status = 'loading'
      const { username, password } = this.loginForm.getRawValue();
      this.authService.login(username, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () =>{
          this.status = 'success';
          this.userService.username = username;
          this.router.navigate(['/app']);
        },
        error: () => {
          this.status = 'failed';
          this.openSnackBar('Login failed', 'Close');
        }}
      )
    } else {
      this.loginForm.markAllAsTouched();
      this.openSnackBar('Login failed', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

}
