import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ImagenGuardada {
  seccion: string;
  nombreSeccion: string;
  imagenUrl: string;
  activada: boolean;
  fecha: Date;
}

interface ImagenSlider {
  id: number;
  imagenUrl: string;
  titulo: string;
  activada: boolean;
}

interface ImagenGaleria {
  id: number;
  imagenUrl: string;
  titulo: string;
  activada: boolean;
}

@Component({
  selector: 'app-editar-imagenes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-imagenes.html',
  styleUrls: ['./editar-imagenes.css']
})
export class EditarImagenes implements OnInit {
  // ========== SECCIÓN 1: IMÁGENES POR GRADO ==========
  imagenPreview: string | null = null;
  imagenSeleccionada: File | null = null;
  seccionSeleccionada: string = 'quienesSomos';
  imagenActivada: boolean = true;
  modoEdicion: boolean = false;
  
  imagenesGuardadas: ImagenGuardada[] = [];
  
  secciones = [
    { valor: 'quienesSomos', nombre: '¿Quiénes Somos?' },
    { valor: 'mision', nombre: 'Misión' },
    { valor: 'vision', nombre: 'Visión' }
  ];

  // ========== SECCIÓN 2: SLIDER ==========
  sliderImages: ImagenSlider[] = [];
  sliderPreview: string | null = null;
  sliderSeleccionado: File | null = null;
  sliderTitulo: string = '';
  sliderEditandoId: number | null = null;
  maxSliderImages: number = 3;

  // ========== SECCIÓN 3: GALERÍA ==========
  galeriaImages: ImagenGaleria[] = [];
  galeriaPreview: string | null = null;
  galeriaSeleccionado: File | null = null;
  galeriaTitulo: string = '';
  galeriaEditandoId: number | null = null;
  maxGaleriaImages: number = 6;

  // Mensajes de validación
  mensajeExito: string = '';
  mensajeError: string = '';
  
  // Errores específicos
  errorImagen: string = '';
  errorSliderImagen: string = '';
  errorSliderTitulo: string = '';
  errorGaleriaImagen: string = '';
  errorGaleriaTitulo: string = '';

  // Control de pestañas
  tabActiva: string = 'grados';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarListaImagenes();
    this.cargarSlider();
    this.cargarGaleria();
  }

  limpiarMensajes(): void {
    setTimeout(() => {
      this.mensajeExito = '';
      this.mensajeError = '';
    }, 3000);
  }

  limpiarErrores(): void {
    this.errorImagen = '';
    this.errorSliderImagen = '';
    this.errorSliderTitulo = '';
    this.errorGaleriaImagen = '';
    this.errorGaleriaTitulo = '';
  }

  // ========== VALIDACIONES GENERALES ==========
  validarImagen(file: File | null): boolean {
    if (!file) {
      this.errorImagen = '❌ Selecciona una imagen';
      return false;
    }
    
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      this.errorImagen = '❌ Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)';
      return false;
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.errorImagen = '❌ La imagen no puede superar los 2MB';
      return false;
    }
    
    this.errorImagen = '';
    return true;
  }

  validarTituloSlider(titulo: string): boolean {
    if (!titulo || titulo.trim() === '') {
      this.errorSliderTitulo = '❌ El título del slide es requerido';
      return false;
    }
    if (titulo.length > 100) {
      this.errorSliderTitulo = '❌ El título no puede tener más de 100 caracteres';
      return false;
    }
    this.errorSliderTitulo = '';
    return true;
  }

  validarImagenSlider(file: File | null): boolean {
    if (!file) {
      this.errorSliderImagen = '❌ Selecciona una imagen para el slider';
      return false;
    }
    
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      this.errorSliderImagen = '❌ Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)';
      return false;
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.errorSliderImagen = '❌ La imagen no puede superar los 2MB';
      return false;
    }
    
    this.errorSliderImagen = '';
    return true;
  }

  validarTituloGaleria(titulo: string): boolean {
    if (!titulo || titulo.trim() === '') {
      this.errorGaleriaTitulo = '❌ El título de la imagen es requerido';
      return false;
    }
    if (titulo.length > 100) {
      this.errorGaleriaTitulo = '❌ El título no puede tener más de 100 caracteres';
      return false;
    }
    this.errorGaleriaTitulo = '';
    return true;
  }

  validarImagenGaleria(file: File | null): boolean {
    if (!file) {
      this.errorGaleriaImagen = '❌ Selecciona una imagen para la galería';
      return false;
    }
    
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      this.errorGaleriaImagen = '❌ Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)';
      return false;
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.errorGaleriaImagen = '❌ La imagen no puede superar los 2MB';
      return false;
    }
    
    this.errorGaleriaImagen = '';
    return true;
  }

  // ========== MÉTODOS PARA IMÁGENES POR GRADO ==========
  cargarListaImagenes(): void {
    this.imagenesGuardadas = [];
    for (const seccion of this.secciones) {
      const imagenUrl = localStorage.getItem(`imagen_${seccion.valor}`);
      const activadaStr = localStorage.getItem(`imagen_${seccion.valor}_activada`);
      if (imagenUrl) {
        this.imagenesGuardadas.push({
          seccion: seccion.valor,
          nombreSeccion: seccion.nombre,
          imagenUrl: imagenUrl,
          activada: activadaStr ? JSON.parse(activadaStr) : true,
          fecha: new Date()
        });
      }
    }
    this.cdr.detectChanges();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.limpiarErrores();
    
    if (!this.validarImagen(file)) {
      event.target.value = '';
      return;
    }
    
    if (file) {
      this.imagenSeleccionada = file;
      this.modoEdicion = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  guardarImagen(): void {
    if (!this.imagenPreview) {
      this.errorImagen = '❌ Selecciona una imagen primero';
      this.limpiarMensajes();
      return;
    }
    
    const imagenExistente = this.imagenesGuardadas.find(img => img.seccion === this.seccionSeleccionada);
    let mensaje = '';
    
    if (imagenExistente && !this.modoEdicion) {
      const confirmar = confirm(`⚠️ Ya existe una imagen en "${this.obtenerNombreSeccion(this.seccionSeleccionada)}". ¿Reemplazar?`);
      if (!confirmar) return;
      mensaje = `🔄 Imagen reemplazada`;
    } else if (imagenExistente && this.modoEdicion) {
      mensaje = `✏️ Imagen actualizada`;
    } else {
      mensaje = `✅ Nueva imagen guardada`;
    }
    
    localStorage.setItem(`imagen_${this.seccionSeleccionada}`, this.imagenPreview);
    localStorage.setItem(`imagen_${this.seccionSeleccionada}_activada`, JSON.stringify(this.imagenActivada));
    this.cargarListaImagenes();
    this.mensajeExito = mensaje;
    this.limpiarMensajes();
    this.limpiarFormularioImagen();
  }

  eliminarImagen(seccion: string): void {
    if (confirm(`¿Eliminar imagen de "${this.obtenerNombreSeccion(seccion)}"?`)) {
      localStorage.removeItem(`imagen_${seccion}`);
      localStorage.removeItem(`imagen_${seccion}_activada`);
      this.cargarListaImagenes();
      if (this.seccionSeleccionada === seccion) {
        this.imagenPreview = null;
        this.imagenSeleccionada = null;
        this.modoEdicion = false;
      }
      this.mensajeExito = '🗑️ Imagen eliminada';
      this.limpiarMensajes();
    }
  }

  editarImagen(seccion: string): void {
    this.seccionSeleccionada = seccion;
    this.modoEdicion = true;
    this.cargarImagenGuardada();
    document.querySelector('.tabla-imagenes')?.scrollIntoView({ behavior: 'smooth' });
  }

  cargarImagenGuardada(): void {
    const imagenUrl = localStorage.getItem(`imagen_${this.seccionSeleccionada}`);
    const activadaStr = localStorage.getItem(`imagen_${this.seccionSeleccionada}_activada`);
    if (imagenUrl) {
      this.imagenPreview = imagenUrl;
      this.imagenActivada = activadaStr ? JSON.parse(activadaStr) : true;
      this.imagenSeleccionada = null;
      this.cdr.detectChanges();
    } else {
      this.imagenPreview = null;
      this.imagenActivada = true;
      this.modoEdicion = false;
      this.cdr.detectChanges();
    }
  }

  obtenerNombreSeccion(valor: string): string {
    const seccion = this.secciones.find(s => s.valor === valor);
    return seccion ? seccion.nombre : valor;
  }

  limpiarFormularioImagen(): void {
    this.imagenPreview = null;
    this.imagenSeleccionada = null;
    this.imagenActivada = true;
    this.modoEdicion = false;
    this.limpiarErrores();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this.cdr.detectChanges();
  }

  onSeccionChange(): void {
    this.modoEdicion = false;
    this.cargarImagenGuardada();
  }

  tieneImagen(seccion: string): boolean {
    return this.imagenesGuardadas.some(img => img.seccion === seccion);
  }

  // ========== MÉTODOS PARA SLIDER ==========
  cargarSlider(): void {
    const sliderGuardado = localStorage.getItem('slider_images');
    if (sliderGuardado) {
      this.sliderImages = JSON.parse(sliderGuardado);
    } else {
      this.sliderImages = [];
    }
    this.cdr.detectChanges();
  }

  guardarSlider(): void {
    localStorage.setItem('slider_images', JSON.stringify(this.sliderImages));
  }

  onSliderFileSelected(event: any): void {
    const file = event.target.files[0];
    this.limpiarErrores();
    
    if (!this.validarImagenSlider(file)) {
      event.target.value = '';
      return;
    }
    
    if (file) {
      this.sliderSeleccionado = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.sliderPreview = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  agregarSliderImage(): void {
    this.limpiarErrores();
    
    if (!this.validarTituloSlider(this.sliderTitulo)) return;
    if (!this.validarImagenSlider(this.sliderSeleccionado)) return;
    
    if (this.sliderImages.length >= this.maxSliderImages) {
      this.errorSliderImagen = `⚠️ Máximo ${this.maxSliderImages} imágenes para el Slider`;
      return;
    }

    const nuevaImagen: ImagenSlider = {
      id: Date.now(),
      imagenUrl: this.sliderPreview!,
      titulo: this.sliderTitulo,
      activada: true
    };
    this.sliderImages.push(nuevaImagen);
    this.guardarSlider();
    this.limpiarFormularioSlider();
    this.mensajeExito = '✅ Imagen agregada al Slider';
    this.limpiarMensajes();
  }

  actualizarSliderImage(): void {
    this.limpiarErrores();
    
    if (!this.validarTituloSlider(this.sliderTitulo)) return;
    
    if (this.sliderEditandoId && this.sliderPreview) {
      const index = this.sliderImages.findIndex(img => img.id === this.sliderEditandoId);
      if (index !== -1) {
        this.sliderImages[index].imagenUrl = this.sliderPreview;
        this.sliderImages[index].titulo = this.sliderTitulo;
        this.guardarSlider();
        this.mensajeExito = '✏️ Imagen actualizada';
        this.limpiarMensajes();
        this.limpiarFormularioSlider();
      }
    }
  }

  editarSliderImage(imagen: ImagenSlider): void {
    this.sliderEditandoId = imagen.id;
    this.sliderPreview = imagen.imagenUrl;
    this.sliderTitulo = imagen.titulo;
    this.cdr.detectChanges();
  }

  eliminarSliderImage(id: number): void {
    if (confirm('¿Eliminar esta imagen del Slider?')) {
      this.sliderImages = this.sliderImages.filter(img => img.id !== id);
      this.guardarSlider();
      this.mensajeExito = '🗑️ Imagen eliminada del Slider';
      this.limpiarMensajes();
      if (this.sliderEditandoId === id) this.limpiarFormularioSlider();
    }
  }

  toggleSliderActivado(imagen: ImagenSlider): void {
    imagen.activada = !imagen.activada;
    this.guardarSlider();
    this.mensajeExito = `📌 Slide "${imagen.titulo}": ${imagen.activada ? 'Activado' : 'Desactivado'}`;
    this.limpiarMensajes();
  }

  limpiarFormularioSlider(): void {
    this.sliderPreview = null;
    this.sliderSeleccionado = null;
    this.sliderTitulo = '';
    this.sliderEditandoId = null;
    this.limpiarErrores();
    const fileInput = document.getElementById('sliderFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this.cdr.detectChanges();
  }

  // ========== MÉTODOS PARA GALERÍA ==========
  cargarGaleria(): void {
    const galeriaGuardado = localStorage.getItem('galeria_images');
    if (galeriaGuardado) {
      this.galeriaImages = JSON.parse(galeriaGuardado);
    } else {
      this.galeriaImages = [];
    }
    this.cdr.detectChanges();
  }

  guardarGaleria(): void {
    localStorage.setItem('galeria_images', JSON.stringify(this.galeriaImages));
  }

  onGaleriaFileSelected(event: any): void {
    const file = event.target.files[0];
    this.limpiarErrores();
    
    if (!this.validarImagenGaleria(file)) {
      event.target.value = '';
      return;
    }
    
    if (file) {
      this.galeriaSeleccionado = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galeriaPreview = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  agregarGaleriaImage(): void {
    this.limpiarErrores();
    
    if (!this.validarTituloGaleria(this.galeriaTitulo)) return;
    if (!this.validarImagenGaleria(this.galeriaSeleccionado)) return;
    
    if (this.galeriaImages.length >= this.maxGaleriaImages) {
      this.errorGaleriaImagen = `⚠️ Máximo ${this.maxGaleriaImages} imágenes para la Galería`;
      return;
    }

    const nuevaImagen: ImagenGaleria = {
      id: Date.now(),
      imagenUrl: this.galeriaPreview!,
      titulo: this.galeriaTitulo,
      activada: true
    };
    this.galeriaImages.push(nuevaImagen);
    this.guardarGaleria();
    this.limpiarFormularioGaleria();
    this.mensajeExito = '✅ Imagen agregada a la Galería';
    this.limpiarMensajes();
  }

  actualizarGaleriaImage(): void {
    this.limpiarErrores();
    
    if (!this.validarTituloGaleria(this.galeriaTitulo)) return;
    
    if (this.galeriaEditandoId && this.galeriaPreview) {
      const index = this.galeriaImages.findIndex(img => img.id === this.galeriaEditandoId);
      if (index !== -1) {
        this.galeriaImages[index].imagenUrl = this.galeriaPreview;
        this.galeriaImages[index].titulo = this.galeriaTitulo;
        this.guardarGaleria();
        this.mensajeExito = '✏️ Imagen actualizada';
        this.limpiarMensajes();
        this.limpiarFormularioGaleria();
      }
    }
  }

  editarGaleriaImage(imagen: ImagenGaleria): void {
    this.galeriaEditandoId = imagen.id;
    this.galeriaPreview = imagen.imagenUrl;
    this.galeriaTitulo = imagen.titulo;
    this.cdr.detectChanges();
  }

  eliminarGaleriaImage(id: number): void {
    if (confirm('¿Eliminar esta imagen de la Galería?')) {
      this.galeriaImages = this.galeriaImages.filter(img => img.id !== id);
      this.guardarGaleria();
      this.mensajeExito = '🗑️ Imagen eliminada de la Galería';
      this.limpiarMensajes();
      if (this.galeriaEditandoId === id) this.limpiarFormularioGaleria();
    }
  }

  toggleGaleriaActivado(imagen: ImagenGaleria): void {
    imagen.activada = !imagen.activada;
    this.guardarGaleria();
    this.mensajeExito = `📌 Imagen "${imagen.titulo}": ${imagen.activada ? 'Activada' : 'Desactivada'}`;
    this.limpiarMensajes();
  }

  limpiarFormularioGaleria(): void {
    this.galeriaPreview = null;
    this.galeriaSeleccionado = null;
    this.galeriaTitulo = '';
    this.galeriaEditandoId = null;
    this.limpiarErrores();
    const fileInput = document.getElementById('galeriaFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this.cdr.detectChanges();
  }
}