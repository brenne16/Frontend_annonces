# 🛒 AnnoncesApp — Plateforme de petites annonces intelligente

> Projet tutoré — THE GC4 TEAM | ENSI  
> Développement d'une plateforme de petites annonces avec moteur de recommandations personnalisées et chatbot intelligent basé sur IA

---

## 📋 Description

AnnoncesApp est une marketplace intelligente inspirée d'Avito et Leboncoin, permettant aux utilisateurs de publier, rechercher et gérer des annonces. La plateforme intègre un moteur de recommandations IA et un chatbot capable de comprendre le langage naturel pour assister les utilisateurs dans leurs recherches.

---

## 👥 Équipe

| Nom | Rôle | Responsabilités |
|-----|------|----------------|
| **Brenne ITSOUHOU** | Chef de projet · Frontend · DevOps | Angular, UI/UX, CI/CD, AWS |
| **Emmanuel** | Backend · Sécurité · IA | Spring Boot, PostgreSQL, JWT, IA |

---

## 🏗️ Architecture
annonces-platform/
├── frontend/          # Application Angular 21
├── backend/           # API REST Spring Boot
├── ia-service/        # Microservice IA Python
├── infra/             # Docker, CI/CD
└── docs/              # Documentation

### Stack technique

**Frontend**
- Angular 21 (Standalone Components, Lazy Loading)
- TypeScript
- SCSS

**Backend**
- Java 21 + Spring Boot 3
- Spring Security + JWT
- PostgreSQL + Hibernate
- Full-text search (PostgreSQL FTS)

**IA**
- Python FastAPI
- NLP pour le chatbot
- Collaborative Filtering + Content-Based Filtering

**Infrastructure**
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- AWS EC2 + S3

---

## ✨ Fonctionnalités

### 📢 Gestion des annonces
- Créer, modifier, supprimer des annonces
- Upload d'images multiples
- Catégorisation automatique par IA
- Filtres par catégorie, prix, localisation

### 🔍 Recherche intelligente
- Recherche full-text
- Filtres avancés (catégorie, prix, ville)
- Suggestions automatiques

### 🤖 Chatbot IA
- Compréhension du langage naturel
- Recherche d'annonces par conversation
- Suggestions personnalisées

### 📊 Dashboard vendeur
- Statistiques (vues, favoris, prix moyen)
- Gestion du statut des annonces
- Top annonces les plus vues
- Messagerie intégrée

### ❤️ Favoris & Messagerie
- Système de favoris
- Messagerie entre acheteurs et vendeurs
- Notifications de nouveaux messages

### 🔐 Authentification
- Inscription / Connexion sécurisée
- JWT avec refresh token
- Gestion des rôles (USER, ADMIN)

---

## 🚀 Installation et démarrage

### Prérequis
- Node.js 22+
- Java 21+
- PostgreSQL 15+
- Python 3.11+
- Docker (optionnel)

### 1. Cloner le dépôt

```bash
git clone https://github.com/brenne16/annonces-platform.git
cd annonces-platform
```

### 2. Démarrer le Backend

```bash
cd backend
# Configurer application.properties avec vos credentials PostgreSQL
./mvnw spring-boot:run
# API disponible sur http://localhost:8080
```

### 3. Démarrer le Frontend

```bash
cd frontend/annonces-frontend
npm install
ng serve
# Application disponible sur http://localhost:4200
```

### 4. Démarrer avec Docker (recommandé)

```bash
docker-compose up -d
```

---

## 🔌 API Endpoints principaux

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Inscription | ❌ |
| POST | `/api/auth/login` | Connexion | ❌ |
| GET | `/api/annonces` | Liste des annonces | ❌ |
| POST | `/api/annonces` | Créer une annonce | ✅ |
| GET | `/api/annonces/{id}` | Détail annonce | ❌ |
| PATCH | `/api/annonces/{id}/statut` | Changer statut | ✅ |
| GET | `/api/categories` | Liste catégories | ❌ |
| GET | `/api/favoris` | Mes favoris | ✅ |
| POST | `/api/favoris/{id}` | Toggle favori | ✅ |
| GET | `/api/messages` | Mes messages | ✅ |
| POST | `/api/messages` | Envoyer message | ✅ |
| GET | `/api/dashboard/vendeur` | Stats vendeur | ✅ |
| POST | `/api/ia/chatbot` | Chatbot IA | ✅ |

---

## 📁 Structure Frontend
src/app/
├── core/
│   ├── guards/        # AuthGuard
│   ├── interceptors/  # JWT Interceptor
│   └── services/      # AuthService, AnnonceService
├── features/
│   ├── annonces/      # Liste, Détail, Création
│   ├── auth/          # Login, Register
│   ├── chatbot/       # Widget chatbot IA
│   ├── dashboard/     # Dashboard vendeur
│   ├── recherche/     # Recherche avancée
│   └── recommandations/
└── shared/
└── components/    # Navbar, Footer, CardAnnonce

---

## 📄 Licence

Projet académique — ENSI 2025-2026  
THE GC4 TEAM — Tous droits réservés