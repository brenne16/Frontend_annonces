import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';
import { AuthService } from '../../../core/services/auth';

interface Recommandation {
  id: string;
  titre: string;
  prix: number;
  ville: string;
  categorie: string;
  imagePrincipaleUrl?: string;
}

@Component({
  selector: 'app-recommandations',
  imports: [CommonModule, RouterLink],
  templateUrl: './recommandations.html',
  styleUrl: './recommandations.scss'
})
export class Recommandations implements OnInit {

  recommandations: Recommandation[] = [];
  methode: string = '';
  isLoading: boolean = true;
  erreur: string = '';
  estConnecte: boolean = false;

  constructor(
    private annonceService: AnnonceService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.estConnecte = this.authService.isLoggedIn();
    if (this.estConnecte) {
      this.chargerRecommandations();
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  chargerRecommandations(): void {
    this.isLoading = true;
    this.annonceService.getRecommandations(10).subscribe({
      next: (response) => {
        this.recommandations = response.recommandations || [];
        this.methode = response.methode || '';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = 'Impossible de charger les recommandations';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}