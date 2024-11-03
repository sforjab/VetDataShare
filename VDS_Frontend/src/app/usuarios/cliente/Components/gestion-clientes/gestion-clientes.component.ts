import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/usuarios/Models/usuario.dto';
import { UsuarioService } from 'src/app/usuarios/Services/usuario.service';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent implements OnInit {
  
  filtros = {
    numIdent: '',
    telefono: '',
    email: '',
    nombre: '',
    apellido1: '',
    apellido2: ''
  };

  clientes: Usuario[] = [];
  columnasTabla: string[] = ['numIdent', 'nombre', 'apellido1', 'apellido2', 'telefono', 'email'];

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {}

  /* buscarClientes() {
    console.log('Filtros aplicados: ', this.filtros);
    this.usuarioService.buscarClientes(this.filtros).subscribe((result: Usuario[]) => {
      console.log('Clientes recibidos del backend: ', result);
      if (result && result.length > 0) {
        this.clientes = result;
        console.log('Clientes asignados al array: ', this.clientes);
      } else {
        console.log('No se recibieron clientes o la lista está vacía.');
      }
    }, error => {
      console.log('Error en la llamada al backend: ', error);
    });
  } */
    buscarClientes() {
      const filtrosAplicados = this.prepararFiltros(this.filtros);
    
      console.log('Filtros aplicados: ', filtrosAplicados);
    
      this.usuarioService.buscarClientes(filtrosAplicados).subscribe((result: Usuario[]) => {
        console.log('Clientes recibidos del backend: ', result);
    
        // Aquí nos aseguramos de que se limpie la lista anterior si no hay resultados nuevos
        this.clientes = result || [];
    
        if (this.clientes.length === 0) {
          console.log('No se encontraron clientes.');
        }
      }, error => {
        console.log('Error en la llamada al backend: ', error);
    
        // En caso de error, también limpiamos los clientes para no mostrar datos obsoletos
        this.clientes = [];
      });
    }

    private prepararFiltros(filtros: any): any {
      return {
        numIdent: filtros.numIdent || undefined,
        nombre: filtros.nombre || undefined,
        apellido1: filtros.apellido1 || undefined,
        apellido2: filtros.apellido2 || undefined,
        telefono: filtros.telefono || undefined,
        email: filtros.email || undefined
      };
    }

    navegarDashboardCliente(clienteId: number): void {
      this.router.navigate(['/cliente'], {
        state: { idCliente: clienteId }
      });
    }
  
}
// TENGO PENDIENTE QUE NO VAN LOS ENLACES AL DASHBOARD DEL CLIENTE