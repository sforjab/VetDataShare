export interface Prueba {
    id: number;
    tipo: TipoPrueba; // TipoPrueba: "IMAGEN" o "ANALÍTICA"
    descripcion?: string;
    fecha: string; // La fecha como string para simplificar la manipulación
    resultado?: string;
    consultaId?: number; // ID de la consulta asociada (opcional)
    mascotaId: number;
}
  
export enum TipoPrueba {
    IMAGEN = 'IMAGEN',
    ANALÍTICA = 'ANALÍTICA'
}