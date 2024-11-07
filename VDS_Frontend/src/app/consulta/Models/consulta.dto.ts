export interface Consulta {
    id: number;
    fechaConsulta: string; // Fecha y hora de la consulta en formato ISO (string)
    motivo: string; // Motivo de la consulta
    notas?: string; // Anotaciones privadas realizadas por el veterinario
    medicacion?: string; // Medicación pautada
    mascotaId: number; // ID de la mascota asociada a la consulta
    veterinarioId: number; // ID del veterinario que realiza la consulta
  }
  