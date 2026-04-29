import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

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
    this.verifierConnexion();
  }

  verifierConnexion(): void {
    this.estConnecte = this.authService.isLoggedIn();
    if (this.estConnecte) {
      this.userPrenom = localStorage.getItem('userPrenom') || '';
      this.userRole = localStorage.getItem('userRole') || '';
    }
    this.cdr.detectChanges();
  }

  seDeconnecter(): void {
    this.authService.logout();
    this.estConnecte = false;
    this.userPrenom = '';
    this.userRole = '';
    this.cdr.detectChanges();
    this.router.navigate(['/annonces']);
  }
}