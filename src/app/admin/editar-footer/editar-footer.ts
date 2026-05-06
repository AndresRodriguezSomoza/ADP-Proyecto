import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-footer.html',
  styleUrls: ['./editar-footer.css']
})
export class EditarFooter implements OnInit {
  telefono: string = '';
  correo: string = '';
  telefonoOriginal: string = '';
  correoOriginal: string = '';
  
  telefonoPreview: string = '';
  correoPreview: string = '';
  hayCambiosSinGuardar: boolean = false;
  
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const telefonoGuardado = localStorage.getItem('footer_telefono');
    const correoGuardado = localStorage.getItem('footer_correo');
    
    // Guardar solo los dígitos (sin +503)
    this.telefono = telefonoGuardado || '2229-9067';
    this.correo = correoGuardado || 'cewas2000@gmail.com';
    this.telefonoOriginal = this.telefono;
    this.correoOriginal = this.correo;
    
    this.actualizarVistaPrevia();
  }

  actualizarVistaPrevia(): void {
    this.telefonoPreview = this.telefono || 'No configurado';
    this.correoPreview = this.correo || 'No configurado';
    this.hayCambiosSinGuardar = (this.telefono !== this.telefonoOriginal) || 
                                 (this.correo !== this.correoOriginal);
  }

  formatearTelefono(valor: string): string {
    // Eliminar cualquier caracter que no sea número o guión
    let limpio = valor.replace(/[^0-9-]/g, '');
    
    // Si tiene guiones, mantenerlos pero limitar
    if (limpio.includes('-')) {
      const partes = limpio.split('-');
      const parte1 = partes[0].substring(0, 4);
      const parte2 = partes[1]?.substring(0, 4) || '';
      return parte2 ? `${parte1}-${parte2}` : parte1;
    }
    
    // Si solo son números, formatear con guión
    const digitos = limpio.replace(/\D/g, '');
    if (digitos.length >= 4) {
      const parte1 = digitos.substring(0, 4);
      const parte2 = digitos.substring(4, 8);
      return parte2 ? `${parte1}-${parte2}` : parte1;
    }
    return digitos;
  }

  onTelefonoInput(): void {
    // Formatear mientras escribe
    this.telefono = this.formatearTelefono(this.telefono);
    this.mensajeError = '';
    this.actualizarVistaPrevia();
  }

  onTelefonoBlur(): void {
    if (!this.telefono) {
      this.mensajeError = '';
      this.actualizarVistaPrevia();
      return;
    }
    
    // Obtener solo dígitos
    const soloDigitos = this.telefono.replace(/\D/g, '');
    
    // Validar
    if (soloDigitos.length === 8) {
      // Asegurar formato correcto
      this.telefono = `${soloDigitos.substring(0, 4)}-${soloDigitos.substring(4, 8)}`;
      this.mensajeError = '';
    } else if (soloDigitos.length > 0 && soloDigitos.length !== 8) {
      this.mensajeError = 'El teléfono debe tener 8 dígitos';
    } else {
      this.mensajeError = '';
    }
    
    this.actualizarVistaPrevia();
  }

  validarCorreo(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const esValido = emailRegex.test(this.correo);
    
    if (this.correo && !esValido) {
      this.mensajeError = 'Ingresa un correo válido (ejemplo: nombre@dominio.com)';
      setTimeout(() => this.mensajeError = '', 3000);
      return false;
    }
    return true;
  }

  onCorreoBlur(): void {
    this.validarCorreo();
    this.actualizarVistaPrevia();
  }

  guardarCambios(): void {
    if (!this.validarCorreo()) {
      return;
    }
    
    const soloDigitos = this.telefono.replace(/\D/g, '');
    if (this.telefono && soloDigitos.length !== 8) {
      this.mensajeError = 'El teléfono debe tener 8 dígitos';
      setTimeout(() => this.mensajeError = '', 3000);
      return;
    }
    
    // Guardar con formato 1234-5678
    const telefonoFormateado = this.telefono || '';
    localStorage.setItem('footer_telefono', telefonoFormateado);
    localStorage.setItem('footer_correo', this.correo);
    
    this.telefonoOriginal = this.telefono;
    this.correoOriginal = this.correo;
    
    this.actualizarVistaPrevia();
    
    this.mensajeExito = '✅ Información del footer guardada correctamente';
    setTimeout(() => this.mensajeExito = '', 3000);
  }

  cancelarCambios(): void {
    this.telefono = this.telefonoOriginal;
    this.correo = this.correoOriginal;
    this.actualizarVistaPrevia();
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}