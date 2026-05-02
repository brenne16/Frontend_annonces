import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {

  ongletActif: string = 'utilisateurs';

  // Utilisateurs
  utilisateurs: any[] = [];
  searchUser: string = '';
  isLoadingUsers: boolean = true;
  actionUserEnCours: string = '';

  // Annonces
  annonces: any[] = [];
  searchAnnonce: string = '';
  filtreStatut: string = '';
  isLoadingAnnonces: boolean = false;
  actionAnnonceEnCours: string = '';

  statutsDisponibles: string[] = ['', 'ACTIVE', 'VENDUE', 'SUSPENDU', 'EXPIREE'];

  constructor(
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  // ===== UTILISATEURS =====

  chargerUtilisateurs(): void {
    this.isLoadingUsers = true;
    this.annonceService.getAdminUtilisateurs(this.searchUser).subscribe({
      next: (response) => {
        this.utilisateurs = response.content || [];
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleUtilisateur(user: any): void {
    this.actionUserEnCours = user.id;
    this.annonceService.toggleUtilisateur(user.id).subscribe({
      next: () => {
        user.actif = !user.actif;
        this.actionUserEnCours = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionUserEnCours = '';
        this.cdr.detectChanges();
      }
    });
  }

  changerRole(user: any, role: string): void {
    this.actionUserEnCours = user.id;
    this.annonceService.changerRoleUtilisateur(user.id, role).subscribe({
      next: () => {
        user.role = role;
        this.actionUserEnCours = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionUserEnCours = '';
        this.cdr.detectChanges();
      }
    });
  }

  // ===== ANNONCES =====

  chargerAnnonces(): void {
    this.isLoadingAnnonces = true;
    this.annonceService.getAdminAnnonces(
      this.searchAnnonce,
      this.filtreStatut
    ).subscribe({
      next: (response) => {
        this.annonces = response.content || [];
        this.isLoadingAnnonces = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingAnnonces = false;
        this.cdr.detectChanges();
      }
    });
  }

  changerStatutAnnonce(annonce: any, statut: string): void {
    this.actionAnnonceEnCours = annonce.id;
    this.annonceService.changerStatutAdmin(annonce.id, statut).subscribe({
      next: () => {
        annonce.statut = statut;
        this.actionAnnonceEnCours = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionAnnonceEnCours = '';
        this.cdr.detectChanges();
      }
    });
  }

  changerOnglet(onglet: string): void {
    this.ongletActif = onglet;
    if (onglet === 'annonces' && this.annonces.length === 0) {
      this.chargerAnnonces();
    }
    this.cdr.detectChanges();
  }

  onSearchUser(): void {
    this.chargerUtilisateurs();
  }

  onSearchAnnonce(): void {
    this.chargerAnnonces();
  }
}