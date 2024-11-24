import { Mascota } from "src/app/mascota/Models/mascota.dto";
import { Usuario } from "src/app/usuarios/Models/usuario.dto";

export interface Consulta {
  id: number;
  fechaConsulta: string; // Fecha y hora en formato ISO (string)
  motivo: string;
  notas?: string;
  medicacion?: string;
  mascotaId: number; // ID de la mascota asociada
  veterinarioId: number; // ID del veterinario asociado
}
  