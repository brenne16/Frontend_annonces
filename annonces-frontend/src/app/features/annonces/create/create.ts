import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';

@Component({
  selector: 'app-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create.html',
  styleUrl: './create.scss'
})
export class Create {

  annonceForm: FormGroup;
  isLoading: boolean = false;
  imagePreview: string = '';
  imageFichier: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {
    this.annonceForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      prix: ['', [Validators.required, Validators.min(1)]],
      categorieId: ['', Validators.required],
      ville: ['', Validators.required]
    });

    // Charge les vraies catégories depuis l'API
    this.annonceService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  get titre() { return this.annonceForm.get('titre'); }
  get description() { return this.annonceForm.get('description'); }
  get prix() { return this.annonceForm.get('prix'); }
  get categorieId() { return this.annonceForm.get('categorieId'); }
  get ville() { return this.annonceForm.get('ville'); }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFichier = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.annonceForm.invalid) {
      this.annonceForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = {
      titre: this.annonceForm.value.titre,
      description: this.annonceForm.value.description,
      prix: Number(this.annonceForm.value.prix),
      categorieId: this.annonceForm.value.categorieId,
      ville: this.annonceForm.value.ville
    };

    // Étape 1 — Créer l'annonce
    this.annonceService.creer(data).subscribe({
      next: (annonceCreee: any) => {

        // Étape 2 — Si une image a été sélectionnée, l'uploader
        if (this.imageFichier && annonceCreee.id) {
          this.annonceService.uploadImage(annonceCreee.id, this.imageFichier).subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/annonces', annonceCreee.id]);
            },
            error: () => {
              // L'annonce est créée mais l'image a échoué
              // On redirige quand même
              this.isLoading = false;
              this.router.navigate(['/annonces', annonceCreee.id]);
            }
          });
        } else {
          // Pas d'image — on redirige directement
          this.isLoading = false;
          this.router.navigate(['/annonces', annonceCreee.id]);
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.status === 401
          ? 'Vous devez être connecté pour publier une annonce'
          : 'Une erreur est survenue, réessayez';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}