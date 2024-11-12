import { Mascota } from "src/app/mascota/Models/mascota.dto";
import { Usuario } from "src/app/usuarios/Models/usuario.dto";

export interface Consulta {
    id: number;
    fechaConsulta: string; // Fecha y hora de la consulta en formato ISO (string)
    motivo: string; // Motivo de la consulta
    notas?: string; // Anotaciones privadas realizadas por el veterinario
    medicacion?: string; // Medicación pautada
    mascota: Mascota; // ID de la mascota asociada a la consulta
    veterinario: Usuario; // ID del veterinario que realiza la consulta
  }
  