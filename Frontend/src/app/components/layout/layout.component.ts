import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, NavBarComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  private userService = inject(UserService)
  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.userService.getProfile(this.userService.username)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(
      {
        next: (user) => {
          this.userService.user$.update(() => user);
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }
}
