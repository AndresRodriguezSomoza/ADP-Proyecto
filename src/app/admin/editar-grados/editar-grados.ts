import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Grado {
  id: number;
  nombre: string;
  descripcion: string;
  pdfUrl: string;
  pdfNombre: string;
  activado: boolean;
  orden: number;
}

@Component({
  selector: 'app-editar-grados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-grados.html',
  styleUrls: ['./editar-grados.css']
})
export class EditarGrados implements OnInit {
  grados: Grado[] = [];

  gradoSeleccionado: Grado | null = null;
  pdfPreview: string | null = null;
  pdfSeleccionado: File | null = null;
  
  mostrarModalAuth: boolean = false;
  authUsuario: string = '';
  authPassword: string = '';
  authError: string = '';
  nuevoGradoNombre: string = '';
  posicionSeleccionadaOrden: number = 0;

  mensajeExito: string = '';
  mensajeError: string = '';
  mensajeValidacion: string = '';

  errorNombre: string = '';
  errorDescripcion: string = '';
  errorPDF: string = '';

  constructor() {}

  ngOnInit(): void {
    this.cargarGrados();
    this.limpiarMensajes();
  }

  limpiarMensajes(): void {
    setTimeout(() => {
      this.mensajeExito = '';
      this.mensajeError = '';
      this.mensajeValidacion = '';
    }, 3000);
  }

  limpiarErroresValidacion(): void {
    this.errorNombre = '';
    this.errorDescripcion = '';
    this.errorPDF = '';
  }

  validarNombre(nombre: string): boolean {
    if (!nombre || nombre.trim() === '') {
      this.errorNombre = '❌ El nombre del grado es requerido';
      return false;
    }
    if (nombre.length < 3) {
      this.errorNombre = '❌ El nombre debe tener al menos 3 caracteres';
      return false;
    }
    if (nombre.length > 100) {
      this.errorNombre = '❌ El nombre no puede tener más de 100 caracteres';
      return false;
    }
    const nombreExistente = this.grados.some(g => 
      g.nombre.toLowerCase() === nombre.toLowerCase() && 
      (!this.gradoSeleccionado || g.id !== this.gradoSeleccionado.id)
    );
    if (nombreExistente) {
      this.errorNombre = '❌ Ya existe un grado con este nombre';
      return false;
    }
    this.errorNombre = '';
    return true;
  }

  validarDescripcion(descripcion: string): boolean {
    if (descripcion && descripcion.length > 500) {
      this.errorDescripcion = '❌ La descripción no puede tener más de 500 caracteres';
      return false;
    }
    this.errorDescripcion = '';
    return true;
  }

  validarPDF(file: File | null): boolean {
    if (!file) {
      this.errorPDF = '';
      return true;
    }
    if (file.type !== 'application/pdf') {
      this.errorPDF = '❌ Solo se permiten archivos PDF';
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorPDF = '❌ El PDF no puede superar los 5MB';
      return false;
    }
    this.errorPDF = '';
    return true;
  }

  validarNuevoGrado(nombre: string): boolean {
    if (!nombre || nombre.trim() === '') {
      this.mensajeValidacion = '❌ Ingresa un nombre para el grado';
      return false;
    }
    if (nombre.length < 3) {
      this.mensajeValidacion = '❌ El nombre debe tener al menos 3 caracteres';
      return false;
    }
    if (nombre.length > 100) {
      this.mensajeValidacion = '❌ El nombre no puede tener más de 100 caracteres';
      return false;
    }
    const nombreExistente = this.grados.some(g => g.nombre.toLowerCase() === nombre.toLowerCase());
    if (nombreExistente) {
      this.mensajeValidacion = '❌ Ya existe un grado con este nombre';
      return false;
    }
    this.mensajeValidacion = '';
    return true;
  }

  validarCredenciales(usuario: string, password: string): boolean {
    if (!usuario || !password) {
      this.authError = '❌ Usuario y contraseña son requeridos';
      return false;
    }
    if (usuario !== 'admin') {
      this.authError = '❌ Usuario incorrecto';
      return false;
    }
    if (password !== '1234') {
      this.authError = '❌ Contraseña incorrecta';
      return false;
    }
    this.authError = '';
    return true;
  }

  inicializarGradosBase(): Grado[] {
    const base = [
      'Parvularia 4',
      'Parvularia 5',
      '1° Básico',
      '2° Básico',
      '3° Básico',
      '4° Básico',
      '5° Básico',
      '6° Básico',
      '7° Básico',
      '8° Básico',
      '1° Bachillerato',
      '2° Bachillerato',
      '1° Bachillerato Técnico en Administración Contable',
      '2° Bachillerato Técnico en Administración Contable',
      '3° Bachillerato Técnico en Administración Contable'
    ];
    
    return base.map((nombre, index) => ({
      id: index + 1,
      nombre: nombre,
      descripcion: '',
      pdfUrl: '',
      pdfNombre: '',
      activado: true,
      orden: index + 1
    }));
  }

  cargarGrados(): void {
    const gradosGuardados = localStorage.getItem('grados');
    if (gradosGuardados) {
      this.grados = JSON.parse(gradosGuardados);
    } else {
      this.grados = this.inicializarGradosBase();
      this.guardarGrados();
    }
    this.ordenarGrados();
  }

  ordenarGrados(): void {
    this.grados.sort((a, b) => a.orden - b.orden);
    let necesitaReordenar = false;
    this.grados.forEach((grado, index) => {
      if (grado.orden !== index + 1) {
        grado.orden = index + 1;
        necesitaReordenar = true;
      }
    });
    if (necesitaReordenar) {
      this.guardarGrados();
    }
  }

  guardarGrados(): void {
    localStorage.setItem('grados', JSON.stringify(this.grados));
  }

  abrirModalAgregarGrado(): void {
    this.ordenarGrados();
    this.nuevoGradoNombre = '';
    this.mensajeValidacion = '';
    
    const parvularia5 = this.grados.find(g => g.nombre === 'Parvularia 5');
    if (parvularia5) {
      this.posicionSeleccionadaOrden = parvularia5.orden;
    } else {
      this.posicionSeleccionadaOrden = 2;
    }
    
    this.mostrarModalAuth = true;
    this.authUsuario = '';
    this.authPassword = '';
    this.authError = '';
  }

  verificarAutorizacion(): void {
    if (!this.validarCredenciales(this.authUsuario, this.authPassword)) {
      return;
    }
    if (!this.validarNuevoGrado(this.nuevoGradoNombre)) {
      return;
    }
    
    this.mostrarModalAuth = false;
    this.agregarGrado();
  }

  agregarGrado(): void {
    this.ordenarGrados();
    
    const gradoReferencia = this.grados.find(g => g.orden === this.posicionSeleccionadaOrden);
    if (!gradoReferencia) {
      this.mensajeError = 'Error: No se encontró el grado de referencia';
      this.limpiarMensajes();
      return;
    }
    
    const nuevoId = Math.max(...this.grados.map(g => g.id), 0) + 1;
    const nuevoGrado: Grado = {
      id: nuevoId,
      nombre: this.nuevoGradoNombre,
      descripcion: '',
      pdfUrl: '',
      pdfNombre: '',
      activado: true,
      orden: gradoReferencia.orden + 0.5
    };
    
    this.grados.push(nuevoGrado);
    this.grados.sort((a, b) => a.orden - b.orden);
    
    this.grados.forEach((grado, index) => {
      grado.orden = index + 1;
    });
    
    this.guardarGrados();
    this.mensajeExito = `✅ Grado "${this.nuevoGradoNombre}" agregado correctamente`;
    this.limpiarMensajes();
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.mostrarModalAuth = false;
    this.authUsuario = '';
    this.authPassword = '';
    this.authError = '';
    this.nuevoGradoNombre = '';
    this.mensajeValidacion = '';
    this.posicionSeleccionadaOrden = 0;
  }

  seleccionarGrado(grado: Grado): void {
    this.limpiarErroresValidacion();
    this.gradoSeleccionado = { ...grado };
    this.pdfPreview = grado.pdfUrl || null;
    document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!this.validarPDF(file)) {
      event.target.value = '';
      return;
    }
    
    if (file) {
      this.pdfSeleccionado = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfPreview = e.target.result;
        if (this.gradoSeleccionado) {
          this.gradoSeleccionado.pdfUrl = e.target.result;
          this.gradoSeleccionado.pdfNombre = file.name;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  limpiarPDF(): void {
    this.pdfPreview = null;
    this.pdfSeleccionado = null;
    if (this.gradoSeleccionado) {
      this.gradoSeleccionado.pdfUrl = '';
      this.gradoSeleccionado.pdfNombre = '';
    }
    const fileInput = document.getElementById('pdfInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  guardarCambios(): void {
    if (!this.gradoSeleccionado) return;
    
    const nombreValido = this.validarNombre(this.gradoSeleccionado.nombre);
    const descripcionValida = this.validarDescripcion(this.gradoSeleccionado.descripcion);
    
    if (!nombreValido || !descripcionValida) {
      this.mensajeError = '❌ Corrige los errores antes de guardar';
      this.limpiarMensajes();
      return;
    }
    
    const index = this.grados.findIndex(g => g.id === this.gradoSeleccionado!.id);
    if (index !== -1) {
      this.grados[index] = { ...this.gradoSeleccionado };
      this.guardarGrados();
      this.mensajeExito = `✅ Cambios guardados para: ${this.gradoSeleccionado.nombre}`;
      this.limpiarMensajes();
      this.cancelarEdicion();
    }
  }

  eliminarGrado(id: number, nombre: string): void {
    if (confirm(`¿Eliminar el grado "${nombre}"? Esta acción no se puede deshacer.`)) {
      this.grados = this.grados.filter(g => g.id !== id);
      this.grados.forEach((grado, index) => {
        grado.orden = index + 1;
      });
      this.guardarGrados();
      this.mensajeExito = `🗑️ Grado "${nombre}" eliminado`;
      this.limpiarMensajes();
      if (this.gradoSeleccionado?.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  toggleActivado(grado: Grado): void {
    grado.activado = !grado.activado;
    this.guardarGrados();
    this.mensajeExito = `📌 ${grado.nombre}: ${grado.activado ? 'Activado' : 'Desactivado'}`;
    this.limpiarMensajes();
  }

  cancelarEdicion(): void {
    this.gradoSeleccionado = null;
    this.pdfPreview = null;
    this.pdfSeleccionado = null;
    this.limpiarErroresValidacion();
    const fileInput = document.getElementById('pdfInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  abrirPDF(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}