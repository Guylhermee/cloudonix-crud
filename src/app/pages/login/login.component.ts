import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  authKey: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.authKey.trim() !== '') {
      localStorage.setItem('authKey', this.authKey);
      this.router.navigate(['/products']);
    } else {
      alert('Authorization key cannot be empty.');
    }
  }
}
