import {UserProfile} from "./User.tsx";

export interface PerfilUsuario {
    id: number;
    usuario: UserProfile;
    codigo_afiliado: string;
    codigo_usado: string;
    receive_email_notifications: boolean;
}