import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';

@Component({
  selector: 'app-recherche',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recherche.html',
  styleUrl: './recherche.scss'
})
export class Recherche {

  searchForm: FormGroup;
  resultats: any[] = [];
  categories: any[] = [];
  rechercheLancee: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      motCle: [''],
      categorieId: [''],
      prixMin: [''],
      prixMax: [''],
      ville: ['']
    });

    this.annonceService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  onSearch(): void {
    this.rechercheLancee = true;
    this.isLoading = true;

    const filtres = {
      query: this.searchForm.value.motCle || null,
      categorieId: this.searchForm.value.categorieId || null,
      ville: this.searchForm.value.ville || null,
      prixMin: this.searchForm.value.prixMin || null,
      prixMax: this.searchForm.value.prixMax || null,
      page: 0,
      size: 12
    };

    this.annonceService.rechercher(filtres).subscribe({
      next: (response) => {
        this.resultats = response.content || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reinitialiser(): void {
    this.searchForm.reset();
    this.resultats = [];
    this.rechercheLancee = false;
    this.cdr.detectChanges();
  }
}