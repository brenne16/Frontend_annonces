import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  mesAnnonces: any[] = [];
  stats: any = null;
  favoris: any[] = [];
  messages: any[] = [];
  isLoading: boolean = true;
  userPrenom: string = '';
  actionEnCours: string = '';
  ongletActif: string = 'stats';

  constructor(
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userPrenom = localStorage.getItem('userPrenom') || '';
    this.chargerDashboard();
  }

  chargerDashboard(): void {
    // Stats dashboard
    this.annonceService.getDashboardVendeur().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    // Mes annonces
    this.annonceService.getMesAnnonces().subscribe({
      next: (response) => {
        this.mesAnnonces = response.content || response || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Favoris
    this.annonceService.getMesFavoris().subscribe({
      next: (data) => {
        this.favoris = data || [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    // Messages
    this.annonceService.getMesMessages().subscribe({
      next: (data) => {
        this.messages = data || [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  changerOnglet(onglet: string): void {
    this.ongletActif = onglet;
    this.cdr.detectChanges();
  }

  changerStatut(annonce: any, nouveauStatut: string): void {
    this.actionEnCours = annonce.id;
    this.annonceService.changerStatut(annonce.id, nouveauStatut).subscribe({
      next: () => {
        annonce.statut = nouveauStatut;
        this.actionEnCours = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionEnCours = '';
        this.cdr.detectChanges();
      }
    });
  }

  getLabelBouton(statut: string): string {
    if (statut === 'ACTIVE') return 'Marquer vendue';
    if (statut === 'VENDUE') return 'Remettre en ligne';
    return 'Activer';
  }

  getProchainStatut(statut: string): string {
    if (statut === 'ACTIVE') return 'VENDUE';
    return 'ACTIVE';
  }

  messagesNonLus(): number {
    return this.messages.filter((m: any) => !m.lu).length;
  }
}