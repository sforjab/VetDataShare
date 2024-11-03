export interface Usuario {
    id?: number;
    numIdent: string;
    numColegiado?: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    rol: Rol;
    username: string;
    password: string;
    clinicaId?: string; // ID de la clínica asociada (solo para veterinarios o admin de clínica)
  }
  
  export enum Rol {
    ADMIN = 'ADMIN',
    ADMIN_CLINICA = 'ADMIN_CLINICA',
    VETERINARIO = 'VETERINARIO',
    CLIENTE = 'CLIENTE'
  }
  