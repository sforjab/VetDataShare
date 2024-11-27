export interface Prueba {
    id?: number;
    tipo: TipoPrueba;
    descripcion?: string;
    fecha: string;
    resultado?: string;
    consultaId: number;
    mascotaId: number;
  }
  
  export enum TipoPrueba {
    IMAGEN = 'IMAGEN',
    ANALÍTICA = 'ANALÍTICA'
  }