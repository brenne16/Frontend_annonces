import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule],
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
  userId: string = '';
  actionEnCours: string = '';
  ongletActif: string = 'stats';

  // Conversation
  conversationOuverte: any = null;
  messagesConversation: any[] = [];
  reponseTexte: string = '';
  envoiEnCours: boolean = false;
  chargementConversation: boolean = false;

  constructor(
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userPrenom = localStorage.getItem('userPrenom') || '';
    this.userId = localStorage.getItem('userId') || '';
    this.chargerDashboard();
  }

  chargerDashboard(): void {
    this.annonceService.getDashboardVendeur().subscribe({
      next: (data) => { this.stats = data; this.cdr.detectChanges(); },
      error: () => {}
    });

    this.annonceService.getMesAnnonces().subscribe({
      next: (response) => {
        this.mesAnnonces = response.content || response || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });

    this.annonceService.getMesFavoris().subscribe({
      next: (data) => { this.favoris = data || []; this.cdr.detectChanges(); },
      error: () => {}
    });

    this.chargerMessages();
  }

  chargerMessages(): void {
    this.annonceService.getMesMessages().subscribe({
      next: (data) => { this.messages = data || []; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  ouvrirConversation(msg: any): void {
    this.conversationOuverte = msg;
    this.chargementConversation = true;
    this.cdr.detectChanges();

    this.annonceService.getConversation(msg.expediteurId).subscribe({
      next: (data) => {
        this.messagesConversation = data || [];
        this.chargementConversation = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargementConversation = false;
        this.cdr.detectChanges();
      }
    });
  }

  fermerConversation(): void {
    this.conversationOuverte = null;
    this.messagesConversation = [];
    this.reponseTexte = '';
    this.chargerMessages();
    this.cdr.detectChanges();
  }

  envoyerReponse(): void {
    if (!this.reponseTexte.trim() || this.envoiEnCours) return;
    this.envoiEnCours = true;

    this.annonceService.repondreMessage(
      this.conversationOuverte.expediteurId,
      this.reponseTexte,
      this.conversationOuverte.annonceId
    ).subscribe({
      next: (nouveauMsg) => {
        this.messagesConversation.push(nouveauMsg);
        this.reponseTexte = '';
        this.envoiEnCours = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.envoiEnCours = false;
        this.cdr.detectChanges();
      }
    });
  }

  onKeydownReponse(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyerReponse();
    }
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

  estMonMessage(msg: any): boolean {
    return msg.expediteurId === this.userId;
  }
}