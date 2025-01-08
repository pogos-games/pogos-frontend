export interface JwtDto {
    sub: string;       // ID unique de l'utilisateur
    email: string;     // Email de l'utilisateur
    username: string;  // Nom d'utilisateur
    iat: number;       // Timestamp d'émission
    exp: number;       // Timestamp d'expiration
}

