import { Mascota } from "src/app/mascota/Models/mascota.dto";
import { Usuario } from "src/app/usuarios/Models/usuario.dto";

export interface Vacuna {
    id: number;
    nombre: string; // Nombre de la vacuna
    laboratorio: string; // Laboratorio de la vacuna
    fecha: string;  // Fecha de administración de la vacuna
    mascota: Mascota; // Mascota asociada a la vacuna
    veterinario: Usuario; // Veterinario que aplica la vacuna
}
  