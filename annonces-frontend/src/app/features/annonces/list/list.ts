import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';

interface Annonce {
  id: string;
  titre: string;
  description: string;
  prix: number;
  ville: string;
  statut: string;
  categorieNom: string;
  vendeurNom: string;
  vendeurPrenom: string;
  imagePrincipaleUrl: string;
  imageUrls: string[];
  tags: string[];
  vues: number;
  createdAt: string;
}

@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {

  annonces: Annonce[] = [];
  categories: any[] = [];
  categorieSelectionnee: any = null;
  isLoading: boolean = true;
  erreur: string = '';

  constructor(
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerAnnonces();
    this.chargerCategories();
  }

 chargerAnnonces(): void {
  this.isLoading = true;
  this.erreur = '';
  this.annonceService.rechercher({
    categorieId: this.categorieSelectionnee?.id || null,
    page: 0,
    size: 12
  }).subscribe({
    next: (response) => {
      this.annonces = response.content || [];
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.erreur = 'Impossible de charger les annonces';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

chargerCategories(): void {
  this.annonceService.getCategories().subscribe({
    next: (cats) => {
      this.categories = cats;
      this.cdr.detectChanges();
    },
    error: () => {}
  });

  }

  get annoncesFiltrees(): Annonce[] {
    return this.annonces;
  }

 filtrerParCategorie(categorie: any): void {
  this.categorieSelectionnee = categorie;
  this.chargerAnnonces();
}
}