import { Prueba } from "src/app/prueba/Models/prueba.dto";
import { Vacuna } from "src/app/vacuna/Models/vacuna.dto";

export interface Consulta {
    id: number;
    fechaConsulta: string; // Fecha y hora de la consulta en formato ISO (string)
    motivo: string; // Motivo de la consulta
    observaciones?: string; // Observaciones públicas realizadas por el veterinario
    notas?: string; // Anotaciones privadas realizadas por el veterinario
    medicacion?: string; // Medicación pautada
    mascotaId: number; // ID de la mascota asociada a la consulta
    veterinarioId: number; // ID del veterinario que realiza la consulta
  }
  