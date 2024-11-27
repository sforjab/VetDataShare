export interface Mascota {
    id?: number;
    fechaAlta?: string;
    numChip: string;
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    fechaNacimiento: string;
    propietarioId: number;
    clinicaId?: number;
}
  