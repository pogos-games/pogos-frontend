import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtDto } from '../model/dto/jwt.dto';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  /**
   * Décoder un token JWT
   * @param token Le JWT à décoder
   * @returns Un objet JwtDto contenant les informations du token
   * @throws Erreur si le token est invalide ou si des propriétés manquent
   */
  decodeToken(token: string): JwtDto {
    return jwtDecode(token);
  }

  /**
   * Obtenir la date d'expiration du token
   * @param exp Timestamp d'expiration (du payload JWT)
   * @returns Une instance de Date correspondant à l'expiration
   */
  getTokenExpirationDate(exp: number): Date {
    return new Date(exp * 1000); // Convertir le timestamp UNIX en Date
  }

  /**
   * Vérifie si un token est expiré
   * @param exp Timestamp d'expiration (du payload JWT)
   * @returns Vrai si le token est expiré, sinon faux
   */
  isTokenExpired(exp: Date): boolean {
    return Date.now() >= exp.getTime();
  }

  /**
   * Vérifie si un JWT est valide et non expiré
   * @param token Le JWT à vérifier
   * @returns Vrai si le token est valide, sinon faux
   */
  isTokenValid(token: string): boolean {
    try {
      const decodedToken = this.decodeToken(token);
      return !this.isTokenExpired(this.getTokenExpirationDate(decodedToken.exp));
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Récupérer le username contenu dans le token
   * @param token Le JWT
   * @returns Le username (ou null si le token est invalide)
   */
  getUsernameFromToken(token: string): string | null {
    try {
      const decodedToken = this.decodeToken(token);
      return decodedToken.username || null;
    } catch (error) {
      console.error('Failed to retrieve username from token:', error);
      return null;
    }
  }

  /**
   * Récupérer l'email contenu dans le token
   * @param token Le JWT
   * @returns L'email (ou null si le token est invalide)
   */
  getEmailFromToken(token: string): string | null {
    try {
      const decodedToken = this.decodeToken(token);
      return decodedToken.email || null;
    } catch (error) {
      console.error('Failed to retrieve email from token:', error);
      return null;
    }
  }
}
