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
  // Propiedades
  telefono: string = '';
  correo: string = '';
  telefonoOriginal: string = '';
  correoOriginal: string = '';
  
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Cargar datos guardados
  cargarDatos(): void {
    const telefonoGuardado = localStorage.getItem('footer_telefono');
    const correoGuardado = localStorage.getItem('footer_correo');
    
    this.telefono = telefonoGuardado || '';
    this.correo = correoGuardado || '';
    this.telefonoOriginal = this.telefono;
    this.correoOriginal = this.correo;
  }

  // Máscara para teléfono (formato: +503 0000-0000)
  aplicarMascaraTelefono(): void {
    let valor = this.telefono.replace(/\D/g, ''); // Eliminar no dígitos
    
    if (valor.length > 0) {
      // Formato: +503 XXXX-XXXX
      if (valor.length <= 4) {
        this.telefono = `+503 ${valor}`;
      } else if (valor.length <= 8) {
        const parte1 = valor.substring(0, 4);
        const parte2 = valor.substring(4);
        this.telefono = `+503 ${parte1}${parte2 ? '-' + parte2 : ''}`;
      } else {
        const parte1 = valor.substring(0, 4);
        const parte2 = valor.substring(4, 8);
        this.telefono = `+503 ${parte1}-${parte2}`;
      }
    } else {
      this.telefono = '';
    }
  }

  // Validar y formatear teléfono al perder foco
  onTelefonoBlur(): void {
    if (this.telefono) {
      const numeros = this.telefono.replace(/\D/g, '');
      if (numeros.length === 8) {
        this.aplicarMascaraTelefono();
      } else if (numeros.length > 0 && numeros.length !== 8) {
        this.mensajeError = 'El teléfono debe tener 8 dígitos (ejemplo: +503 1234-5678)';
        setTimeout(() => this.mensajeError = '', 3000);
      }
    }
  }

  // Máscara para correo (validación básica)
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
  }

  // Guardar cambios
  guardarCambios(): void {
    if (!this.validarCorreo()) {
      return;
    }
    
    // Validar teléfono (si tiene contenido, debe tener 8 dígitos)
    const numerosTelefono = this.telefono.replace(/\D/g, '');
    if (this.telefono && numerosTelefono.length !== 8) {
      this.mensajeError = 'El teléfono debe tener 8 dígitos';
      setTimeout(() => this.mensajeError = '', 3000);
      return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('footer_telefono', this.telefono);
    localStorage.setItem('footer_correo', this.correo);
    
    this.telefonoOriginal = this.telefono;
    this.correoOriginal = this.correo;
    
    this.mensajeExito = '✅ Información del footer guardada correctamente';
    setTimeout(() => this.mensajeExito = '', 3000);
  }

  // Cancelar cambios
  cancelarCambios(): void {
    this.telefono = this.telefonoOriginal;
    this.correo = this.correoOriginal;
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}