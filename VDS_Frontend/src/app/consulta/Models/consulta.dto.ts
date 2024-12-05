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
  