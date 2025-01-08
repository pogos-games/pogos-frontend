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
   * @returns Le payload décodé du token
   */
  decodeToken(token: string): JwtDto {
    try {
      return jwtDecode<JwtDto>(token);
    } catch (error) {
      console.error('Invalid JWT token:', error);
      throw new Error('Failed to decode JWT');
    }
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
  isTokenExpired(exp: number): boolean {
    return Date.now() >= exp * 1000;
  }

  /**
   * Vérifie si un JWT est valide et non expiré
   * @param token Le JWT à vérifier
   * @returns Vrai si le token est valide, sinon faux
   */
  isTokenValid(token: string): boolean {
    try {
      const decodedToken = this.decodeToken(token);
      return !this.isTokenExpired(decodedToken.exp);
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}
