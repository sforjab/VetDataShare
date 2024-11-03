export interface Vacuna {
    id: number;
    nombre: string; // Nombre de la vacuna
    laboratorio: string; // Laboratorio de la vacuna
    fecha: string;  // Fecha de administración de la vacuna
    mascotaId: number; // ID de la mascota asociada a la vacuna
    veterinarioId: number; //ID del veterinario que aplica la vacuna
}
  