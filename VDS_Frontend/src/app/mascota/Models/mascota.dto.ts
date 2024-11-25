export interface Mascota {
    id?: number;
    numChip: string;
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    fechaNacimiento: string;  // Usamos string para simplificar la manipulación de fechas
    propietarioId: number;  // Referencia al usuario propietario de la mascota
}
  