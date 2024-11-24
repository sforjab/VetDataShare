export class GenerarAccesoRequestDTO {
    usuarioId: number;
    mascotaId: number;
  
    constructor(usuarioId: number, mascotaId: number) {
      this.usuarioId = usuarioId;
      this.mascotaId = mascotaId;
    }
}
  