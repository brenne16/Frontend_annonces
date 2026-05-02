import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnonceService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  rechercher(filtres: any) {
    let params = new HttpParams();
    if (filtres.query) params = params.set('query', filtres.query);
    if (filtres.categorieId) params = params.set('categorieId', filtres.categorieId);
    if (filtres.ville) params = params.set('ville', filtres.ville);
    if (filtres.prixMin) params = params.set('prixMin', filtres.prixMin);
    if (filtres.prixMax) params = params.set('prixMax', filtres.prixMax);
    params = params.set('page', filtres.page || 0);
    params = params.set('size', filtres.size || 12);
    return this.http.get<any>(`${this.api}/annonces`, { params });
  }

  getById(id: string) {
    return this.http.get<any>(`${this.api}/annonces/${id}`);
  }

  creer(data: any) {
    return this.http.post<any>(`${this.api}/annonces`, data);
  }

  modifier(id: string, data: any) {
    return this.http.put<any>(`${this.api}/annonces/${id}`, data);
  }

  supprimer(id: string) {
    return this.http.delete(`${this.api}/annonces/${id}`);
  }

  getMesAnnonces(page = 0, size = 12) {
    return this.http.get<any>(`${this.api}/annonces/mes-annonces?page=${page}&size=${size}`);
  }

  uploadImage(annonceId: string, fichier: File) {
    const formData = new FormData();
    formData.append('fichiers', fichier);
    return this.http.post<any>(`${this.api}/images/annonce/${annonceId}`, formData);
  }

  getCategories() {
    return this.http.get<any[]>(`${this.api}/categories`);
  }

  changerStatut(id: string, statut: string) {
  return this.http.patch<any>(
    `${this.api}/annonces/${id}/statut`,
    { statut }
  );
}

// Dashboard vendeur
getDashboardVendeur() {
  return this.http.get<any>(`${this.api}/dashboard/vendeur`);
}

// Favoris
toggleFavori(annonceId: string) {
  return this.http.post<any>(`${this.api}/favoris/${annonceId}`, {});
}

getMesFavoris() {
  return this.http.get<any[]>(`${this.api}/favoris`);
}

// Messages
envoyerMessage(destinataireId: string, annonceId: string, contenu: string) {
  return this.http.post<any>(`${this.api}/messages`, {
    destinataireId,
    annonceId,
    contenu
  });
}

getMesMessages() {
  return this.http.get<any[]>(`${this.api}/messages`);
}

envoyerMessageChatbot(message: string, sessionId?: string) {
  return this.http.post<any>(`${this.api}/ia/chatbot`, {
    message,
    session_id: sessionId || null
  });
}

getRecommandations(limit: number = 10) {
  return this.http.get<any>(`${this.api}/ia/recommandations?limit=${limit}`);
}
}