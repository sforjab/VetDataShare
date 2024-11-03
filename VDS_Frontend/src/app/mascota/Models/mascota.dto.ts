export interface Mascota {
    id?: number;
    numChip: string;
    nombre: string;
    especie: string;
    raza: string;
    fechaNacimiento: string;  // Usamos string para simplificar la manipulación de fechas
    usuarioId: number;  // Referencia al usuario propietario de la mascota
    /* pruebas?: Prueba[];  // Lista de pruebas asociadas a la mascota, opcional
    vacunas?: Vacuna[];  // Lista de vacunas asociadas a la mascota, opcional */
}
  