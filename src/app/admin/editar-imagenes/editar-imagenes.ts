import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageDBService, ImagenSlider, ImagenGaleria, ImagenGrado } from '../../services/image-db.service';

interface ImagenGuardada {
  seccion: string;
  nombreSeccion: string;
  imagenUrl: string;
  activada: boolean;
  fecha: Date;
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
  maxGaleriaImages: number = 4;

  mensajeExito: string = '';
  mensajeError: string = '';
  
  errorImagen: string = '';
  errorSliderImagen: string = '';
  errorSliderTitulo: string = '';
  errorGaleriaImagen: string = '';
  errorGaleriaTitulo: string = '';

  tabActiva: string = 'grados';

  constructor(
    private cdr: ChangeDetectorRef,
    private imageDB: ImageDBService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarListaImagenes();
    await this.cargarSlider();
    await this.cargarGaleria();
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
    
    const maxSize = 2 * 1024 * 1024;
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
    
    const maxSize = 2 * 1024 * 1024;
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
    
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorGaleriaImagen = '❌ La imagen no puede superar los 2MB';
      return false;
    }
    
    this.errorGaleriaImagen = '';
    return true;
  }

  // ========== MÉTODOS PARA IMÁGENES POR GRADO ==========
  async cargarListaImagenes(): Promise<void> {
    const imagenes = await this.imageDB.listarImagenesGrado();
    this.imagenesGuardadas = [];
    
    for (const img of imagenes) {
      // Crear URL fresca para cada imagen
      const url = URL.createObjectURL(img.blob);
      this.imagenesGuardadas.push({
        seccion: img.seccion,
        nombreSeccion: this.obtenerNombreSeccion(img.seccion),
        imagenUrl: url,
        activada: img.activada,
        fecha: img.fecha
      });
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

  async guardarImagen(): Promise<void> {
    if (!this.imagenSeleccionada) {
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
    
    await this.imageDB.guardarImagenGrado(
      this.seccionSeleccionada,
      this.imagenSeleccionada,
      this.imagenActivada
    );
    
    await this.cargarListaImagenes();
    this.mensajeExito = mensaje;
    this.limpiarMensajes();
    this.limpiarFormularioImagen();
  }

  async eliminarImagen(seccion: string): Promise<void> {
    if (confirm(`¿Eliminar imagen de "${this.obtenerNombreSeccion(seccion)}"?`)) {
      await this.imageDB.eliminarImagenGrado(seccion);
      await this.cargarListaImagenes();
      if (this.seccionSeleccionada === seccion) {
        this.imagenPreview = null;
        this.imagenSeleccionada = null;
        this.modoEdicion = false;
      }
      this.mensajeExito = '🗑️ Imagen eliminada';
      this.limpiarMensajes();
    }
  }

  async editarImagen(seccion: string): Promise<void> {
    this.seccionSeleccionada = seccion;
    this.modoEdicion = true;
    await this.cargarImagenGuardada();
  }

  async cargarImagenGuardada(): Promise<void> {
    const imagen = await this.imageDB.obtenerImagenGrado(this.seccionSeleccionada);
    if (imagen) {
      this.imagenPreview = imagen.url;
      this.imagenActivada = imagen.activada;
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

  async onSeccionChange(): Promise<void> {
    this.modoEdicion = false;
    await this.cargarImagenGuardada();
  }

  tieneImagen(seccion: string): boolean {
    return this.imagenesGuardadas.some(img => img.seccion === seccion);
  }

  // ========== MÉTODOS PARA SLIDER ==========
  async cargarSlider(): Promise<void> {
    this.sliderImages = await this.imageDB.obtenerSlider();
    this.cdr.detectChanges();
  }

  async guardarSliderData(): Promise<void> {
    await this.imageDB.guardarSlider(this.sliderImages);
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

  async agregarSliderImage(): Promise<void> {
    this.limpiarErrores();
    
    if (!this.validarTituloSlider(this.sliderTitulo)) return;
    if (!this.sliderSeleccionado) {
      this.errorSliderImagen = '❌ Selecciona una imagen';
      return;
    }
    
    if (this.sliderImages.length >= this.maxSliderImages) {
      this.errorSliderImagen = `⚠️ Máximo ${this.maxSliderImages} imágenes para el Slider`;
      return;
    }

    const nuevaImagen: ImagenSlider = {
      id: Date.now(),
      blob: this.sliderSeleccionado,
      url: this.sliderPreview!,
      titulo: this.sliderTitulo,
      activada: true,
      fecha: new Date()
    };
    
    this.sliderImages.push(nuevaImagen);
    await this.guardarSliderData();
    this.limpiarFormularioSlider();
    this.mensajeExito = '✅ Imagen agregada al Slider';
    this.limpiarMensajes();
  }

  async actualizarSliderImage(): Promise<void> {
    this.limpiarErrores();
    
    if (!this.validarTituloSlider(this.sliderTitulo)) return;
    
    if (this.sliderEditandoId && this.sliderSeleccionado) {
      const index = this.sliderImages.findIndex(img => img.id === this.sliderEditandoId);
      if (index !== -1) {
        this.sliderImages[index].blob = this.sliderSeleccionado;
        this.sliderImages[index].url = this.sliderPreview!;
        this.sliderImages[index].titulo = this.sliderTitulo;
        await this.guardarSliderData();
        this.mensajeExito = '✏️ Imagen actualizada';
        this.limpiarMensajes();
        this.limpiarFormularioSlider();
      }
    }
  }

  editarSliderImage(imagen: ImagenSlider): void {
    this.sliderEditandoId = imagen.id;
    this.sliderPreview = imagen.url;
    this.sliderTitulo = imagen.titulo;
    this.cdr.detectChanges();
  }

  async eliminarSliderImage(id: number): Promise<void> {
    if (confirm('¿Eliminar esta imagen del Slider?')) {
      this.sliderImages = this.sliderImages.filter(img => img.id !== id);
      await this.guardarSliderData();
      this.mensajeExito = '🗑️ Imagen eliminada del Slider';
      this.limpiarMensajes();
      if (this.sliderEditandoId === id) this.limpiarFormularioSlider();
    }
  }

  async toggleSliderActivado(imagen: ImagenSlider): Promise<void> {
    imagen.activada = !imagen.activada;
    await this.guardarSliderData();
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
  async cargarGaleria(): Promise<void> {
    this.galeriaImages = await this.imageDB.obtenerGaleria();
    this.cdr.detectChanges();
  }

  async guardarGaleriaData(): Promise<void> {
    await this.imageDB.guardarGaleria(this.galeriaImages);
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

  async agregarGaleriaImage(): Promise<void> {
    this.limpiarErrores();
    
    if (!this.validarTituloGaleria(this.galeriaTitulo)) return;
    if (!this.galeriaSeleccionado) {
      this.errorGaleriaImagen = '❌ Selecciona una imagen';
      return;
    }
    
    if (this.galeriaImages.length >= this.maxGaleriaImages) {
      this.errorGaleriaImagen = `⚠️ Máximo ${this.maxGaleriaImages} imágenes para la Galería`;
      return;
    }

    const nuevaImagen: ImagenGaleria = {
      id: Date.now(),
      blob: this.galeriaSeleccionado,
      url: this.galeriaPreview!,
      titulo: this.galeriaTitulo,
      activada: true,
      fecha: new Date()
    };
    
    this.galeriaImages.push(nuevaImagen);
    await this.guardarGaleriaData();
    this.limpiarFormularioGaleria();
    this.mensajeExito = '✅ Imagen agregada a la Galería';
    this.limpiarMensajes();
  }

  async actualizarGaleriaImage(): Promise<void> {
    this.limpiarErrores();
    
    if (!this.validarTituloGaleria(this.galeriaTitulo)) return;
    
    if (this.galeriaEditandoId && this.galeriaSeleccionado) {
      const index = this.galeriaImages.findIndex(img => img.id === this.galeriaEditandoId);
      if (index !== -1) {
        this.galeriaImages[index].blob = this.galeriaSeleccionado;
        this.galeriaImages[index].url = this.galeriaPreview!;
        this.galeriaImages[index].titulo = this.galeriaTitulo;
        await this.guardarGaleriaData();
        this.mensajeExito = '✏️ Imagen actualizada';
        this.limpiarMensajes();
        this.limpiarFormularioGaleria();
      }
    }
  }

  editarGaleriaImage(imagen: ImagenGaleria): void {
    this.galeriaEditandoId = imagen.id;
    this.galeriaPreview = imagen.url;
    this.galeriaTitulo = imagen.titulo;
    this.cdr.detectChanges();
  }

  async eliminarGaleriaImage(id: number): Promise<void> {
    if (confirm('¿Eliminar esta imagen de la Galería?')) {
      this.galeriaImages = this.galeriaImages.filter(img => img.id !== id);
      await this.guardarGaleriaData();
      this.mensajeExito = '🗑️ Imagen eliminada de la Galería';
      this.limpiarMensajes();
      if (this.galeriaEditandoId === id) this.limpiarFormularioGaleria();
    }
  }

  async toggleGaleriaActivado(imagen: ImagenGaleria): Promise<void> {
    imagen.activada = !imagen.activada;
    await this.guardarGaleriaData();
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