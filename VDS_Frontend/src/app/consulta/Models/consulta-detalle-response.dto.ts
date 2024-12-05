import { Clinica } from "src/app/clinica/Models/clinica.dto";
import { Mascota } from "src/app/mascota/Models/mascota.dto";
import { Prueba } from "src/app/prueba/Models/prueba.dto";
import { Usuario } from "src/app/usuarios/Models/usuario.dto";
import { Vacuna } from "src/app/vacuna/Models/vacuna.dto";
import { Consulta } from "./consulta.dto";

export interface ConsultaDetalleResponse {
  consulta: Consulta;
  pruebas: Prueba[];
  vacunas: Vacuna[];
  mascota: Mascota;
  veterinario: Usuario;
  clinica: Clinica | null;
}
