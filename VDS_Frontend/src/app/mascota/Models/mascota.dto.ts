import { Usuario } from "src/app/usuarios/Models/usuario.dto";

export interface Mascota {
    id?: number;
    numChip: string;
    nombre: string;
    especie: string;
    raza: string;
    fechaNacimiento: string;  // Usamos string para simplificar la manipulación de fechas
    usuario: Usuario;  // Referencia al usuario propietario de la mascota
}
  