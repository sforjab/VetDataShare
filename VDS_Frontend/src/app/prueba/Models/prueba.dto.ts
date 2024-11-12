import { Consulta } from "src/app/consulta/Models/consulta.dto";
import { Mascota } from "src/app/mascota/Models/mascota.dto";

export interface Prueba {
    id?: number;
    tipo: TipoPrueba; // TipoPrueba: "IMAGEN" o "ANALÍTICA"
    descripcion?: string;
    fecha: string; // La fecha como string para simplificar la manipulación
    resultado?: string;
    consulta: Consulta;
    mascota: Mascota;
}
  
export enum TipoPrueba {
    IMAGEN = 'IMAGEN',
    ANALÍTICA = 'ANALÍTICA'
}