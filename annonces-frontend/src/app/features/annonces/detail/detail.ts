import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';

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
  vendeurId: string;
  imagePrincipaleUrl: string;
  imageUrls: string[];
  tags: string[];
  vues: number;
  createdAt: string;
}

@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail implements OnInit {

  annonce: Annonce | null = null;
  isLoading: boolean = true;
  erreur: string = '';
  estFavori: boolean = false;
  favoriEnCours: boolean = false;
  messageVisible: boolean = false;
  messageTexte: string = '';
  messageEnvoi: boolean = false;
  messageSucces: boolean = false;
  estConnecte: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.estConnecte = this.authService.isLoggedIn();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.annonceService.getById(id).subscribe({
        next: (data) => {
          this.annonce = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.erreur = 'Annonce introuvable';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  toggleFavori(): void {
    if (!this.annonce || this.favoriEnCours) return;
    this.favoriEnCours = true;

    this.annonceService.toggleFavori(this.annonce.id).subscribe({
      next: (response) => {
        this.estFavori = response.favori;
        this.favoriEnCours = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.favoriEnCours = false;
        this.cdr.detectChanges();
      }
    });
  }

  ouvrirMessage(): void {
    this.messageVisible = true;
    this.cdr.detectChanges();
  }

  envoyerMessage(): void {
    if (!this.annonce || !this.messageTexte.trim()) return;
    this.messageEnvoi = true;

    this.annonceService.envoyerMessage(
      this.annonce.vendeurId,
      this.annonce.id,
      this.messageTexte
    ).subscribe({
      next: () => {
        this.messageSucces = true;
        this.messageTexte = '';
        this.messageEnvoi = false;
        this.messageVisible = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.messageEnvoi = false;
        this.cdr.detectChanges();
      }
    });
  }
}