import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get motDePasse() { return this.loginForm.get('motDePasse'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, motDePasse } = this.loginForm.value;

    this.authService.login(email, motDePasse).subscribe({
      next: (response) => {
        this.authService.saveToken(response.accessToken);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userNom', response.nom);
        localStorage.setItem('userPrenom', response.prenom);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userRole', response.role);
        this.router.navigate(['/annonces']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.status === 401
          ? 'Email ou mot de passe incorrect'
          : 'Une erreur est survenue, réessayez';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}