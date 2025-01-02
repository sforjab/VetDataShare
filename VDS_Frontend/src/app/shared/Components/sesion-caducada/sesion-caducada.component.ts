import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion-caducada',
  templateUrl: './sesion-caducada.component.html',
  styleUrl: './sesion-caducada.component.css'
})
export class SesionCaducadaComponent implements OnInit {
  idUsuarioSesion: string | null = null;
  rolUsuarioSesion: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.idUsuarioSesion = sessionStorage.getItem('idUsuario');
    this.rolUsuarioSesion = sessionStorage.getItem('rol');
  }

  navegarLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navegarInicio(): void {
    this.router.navigate(['/']);
  }
}
