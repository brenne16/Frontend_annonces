import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';

interface Message {
  role: 'user' | 'bot';
  contenu: string;
  annonces?: any[];
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot-widget',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.scss'
})
export class ChatbotWidget {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: Message[] = [
    {
      role: 'bot',
      contenu: 'Bonjour ! Je suis votre assistant AnnoncesApp. Comment puis-je vous aider ? Vous pouvez me demander de trouver des annonces, par exemple : "Je cherche un iPhone pas cher" ou "Montre-moi des vélos à Paris".',
      timestamp: new Date()
    }
  ];

  inputMessage: string = '';
  isLoading: boolean = false;
  sessionId: string = '';

  // Widget flottant fermé par défaut
  estOuvert: boolean = false;

  constructor(
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleChatbot(): void {
    this.estOuvert = !this.estOuvert;
    this.cdr.detectChanges();
    if (this.estOuvert) {
      setTimeout(() => this.scrollBas(), 100);
    }
  }

  envoyerMessage(): void {
    if (!this.inputMessage.trim() || this.isLoading) return;

    const texteUser = this.inputMessage.trim();
    this.inputMessage = '';

    // Ajoute le message utilisateur
    this.messages.push({
      role: 'user',
      contenu: texteUser,
      timestamp: new Date()
    });

    this.isLoading = true;
    this.cdr.detectChanges();
    this.scrollBas();

    this.annonceService.envoyerMessageChatbot(texteUser, this.sessionId).subscribe({
      next: (response) => {
        // Sauvegarde le session_id pour la continuité de la conversation
        if (response.session_id) {
          this.sessionId = response.session_id;
        }

        this.messages.push({
          role: 'bot',
          contenu: response.reponse,
          annonces: response.annonces_suggerees || [],
          timestamp: new Date()
        });

        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollBas();
      },
      error: () => {
        this.messages.push({
          role: 'bot',
          contenu: 'Désolé, je rencontre un problème. Réessayez dans un moment.',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollBas();
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyerMessage();
    }
  }

  scrollBas(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  reinitialiser(): void {
    this.sessionId = '';
    this.messages = [
      {
        role: 'bot',
        contenu: 'Conversation réinitialisée. Comment puis-je vous aider ?',
        timestamp: new Date()
      }
    ];
    this.cdr.detectChanges();
  }
}