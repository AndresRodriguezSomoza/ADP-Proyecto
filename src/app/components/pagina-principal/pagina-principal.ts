import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { InfoLocal, InfoPagina } from '../../services/info-local';
import { ImageDBService, ImagenGaleria } from '../../services/image-db.service';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [Navbar, FooterComponent, CommonModule],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.css']
})
export class PaginaPrincipalComponent implements OnInit {
  private infoLocal = inject(InfoLocal);
  private imageDB = inject(ImageDBService);
  private cdr = inject(ChangeDetectorRef);
  
  // Textos
  quienesSomos: string = '';
  mision: string = '';
  vision: string = '';
  
  // Imágenes por grado
  imagenQuienesSomos: string | null = null;
  imagenMision: string | null = null;
  imagenVision: string | null = null;
  
  imagenQuienesSomosActivada: boolean = true;
  imagenMisionActivada: boolean = true;
  imagenVisionActivada: boolean = true;

  // Galería
  galeriaImages: { url: string; titulo: string; activada: boolean }[] = [];

  async ngOnInit(): Promise<void> {
    this.cargarInformacion();
    await this.cargarImagenes();
    await this.cargarGaleria();
  }

  cargarInformacion(): void {
    const info: InfoPagina = this.infoLocal.obtenerInfo();
    this.quienesSomos = info.quienesSomos;
    this.mision = info.mision;
    this.vision = info.vision;
  }

  async cargarImagenes(): Promise<void> {
    const imagenes = await this.imageDB.listarImagenesGrado();
    
    for (const img of imagenes) {
      const url = URL.createObjectURL(img.blob);
      if (img.seccion === 'quienesSomos') {
        this.imagenQuienesSomos = url;
        this.imagenQuienesSomosActivada = img.activada;
      } else if (img.seccion === 'mision') {
        this.imagenMision = url;
        this.imagenMisionActivada = img.activada;
      } else if (img.seccion === 'vision') {
        this.imagenVision = url;
        this.imagenVisionActivada = img.activada;
      }
    }
    this.cdr.detectChanges();
  }

  async cargarGaleria(): Promise<void> {
    const imagenes = await this.imageDB.obtenerGaleria();
    this.galeriaImages = [];
    
    for (const img of imagenes) {
      if (img.activada) {
        const url = URL.createObjectURL(img.blob);
        this.galeriaImages.push({
          url: url,
          titulo: img.titulo,
          activada: img.activada
        });
      }
    }
    this.cdr.detectChanges();
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}