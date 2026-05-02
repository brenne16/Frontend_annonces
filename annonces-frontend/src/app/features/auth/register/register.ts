import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  registerForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmMotDePasse: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup) {
    const mdp = form.get('motDePasse')?.value;
    const confirm = form.get('confirmMotDePasse')?.value;
    return mdp === confirm ? null : { passwordsMismatch: true };
  }

  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get motDePasse() { return this.registerForm.get('motDePasse'); }
  get confirmMotDePasse() { return this.registerForm.get('confirmMotDePasse'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges();
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { nom, email, motDePasse } = this.registerForm.value;

    this.authService.register({ nom, email, motDePasse }).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.status === 409
          ? 'Cet email est déjà utilisé'
          : 'Une erreur est survenue, réessayez';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}