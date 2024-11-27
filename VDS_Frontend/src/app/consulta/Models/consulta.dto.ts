import { Mascota } from "src/app/mascota/Models/mascota.dto";
import { Usuario } from "src/app/usuarios/Models/usuario.dto";

export interface Consulta {
  id?: number;
  fechaConsulta: string;
  motivo: string;
  notas?: string;
  medicacion?: string;
  mascotaId: number;
  veterinarioId: number;
  clinicaId?: number;
  pruebaIds: number[];
  vacunaIds: number[];
}
  