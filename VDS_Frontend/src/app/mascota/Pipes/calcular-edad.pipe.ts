import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcularEdad'
})
export class CalcularEdadPipe implements PipeTransform {

  transform(fechaNacimiento: string, tipo: 'años' | 'meses'): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edadAnios = hoy.getFullYear() - nacimiento.getFullYear();
    let edadMeses = hoy.getMonth() - nacimiento.getMonth();

    // Ajuste si aún no ha llegado al mes de nacimiento este año
    if (edadMeses < 0 || (edadMeses === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadAnios--;
      edadMeses += 12;
    }

    // Si se solicita los años
    if (tipo === 'años') {
      return edadAnios;
    }

    // Si se solicitan los meses
    if (tipo === 'meses') {
      return edadMeses;
    }

    return 0;
  }
}
