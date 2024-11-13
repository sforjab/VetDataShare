import { Mascota } from "src/app/mascota/Models/mascota.dto";
import { Usuario } from "src/app/usuarios/Models/usuario.dto";

export interface AccesoTemporal {
  id?: number;
  token: string;
  tipo: string;
  fechaExpiracion: string;
  usuario: Usuario;
  mascota: Mascota;
}
