import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {

  estConnecte: boolean = false;
  userPrenom: string = '';
  userRole: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Vérifie l'état à chaque changement de page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.verifierConnexion();
    });

    // Vérifie au démarrage
    this.verifierConnexion();
  }

  verifierConnexion(): void {
    this.estConnecte = this.authService.isLoggedIn();
    if (this.estConnecte) {
      this.userPrenom = localStorage.getItem('userPrenom') || '';
      this.userRole = localStorage.getItem('userRole') || '';
    } else {
      this.userPrenom = '';
      this.userRole = '';
    }
    this.cdr.detectChanges();
  }

  seDeconnecter(): void {
    this.authService.logout();
    this.verifierConnexion();
    this.router.navigate(['/annonces']);
  }
}