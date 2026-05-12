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
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      telephone: [''],
      ville: ['']
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup) {
    const mdp = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return mdp === confirm ? null : { passwordsMismatch: true };
  }

  get prenom() { return this.registerForm.get('prenom'); }
  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

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

    const { prenom, nom, email, password, telephone, ville } = this.registerForm.value;

    this.authService.register({
      prenom,
      nom,
      email,
      password,
      telephone: telephone || '',
      ville: ville || ''
    }).subscribe({
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