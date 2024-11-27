import { Mascota } from "src/app/mascota/Models/mascota.dto";
import { Usuario } from "src/app/usuarios/Models/usuario.dto";

export interface Vacuna {
    id?: number;
    nombre: string; // Nombre de la vacuna
    laboratorio: string; // Laboratorio de la vacuna
    fecha: string;  // Fecha de administración de la vacuna
    mascotaId: number; // ID de la mascota asociada a la vacuna
    veterinarioId: number; // ID del veterinario que admiistra la vacuna
    consultaId: number; // ID de la consulta donde se administra la vacuna
}
  