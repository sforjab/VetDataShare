export class AuthResponseDTO {
    token: string;
    rol: string;
    idUsuario: string;
  
    constructor(token: string = '', rol: string = '', idUsuario: string = '') {
      this.token = token;
      this.rol = rol;
      this.idUsuario = idUsuario;
    }
}
  