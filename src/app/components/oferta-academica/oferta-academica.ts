import { Component } from "@angular/core";
import { Navbar } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: "app-oferta-academica",
  standalone: true,
  imports: [Navbar, FooterComponent],
  templateUrl: "./oferta-academica.html",
  styleUrl: "./oferta-academica.css",
})
export class OfertaAcademica {
  listaGrados = [
    { 
      nivel: 'Parvularia', 
      descripcion: 'Enfoque en el desarrollo psicomotriz, social y afectivo de los más pequeños, sentando las bases del aprendizaje mediante el juego y valores.', 
      color: '#1E3A5F', 
      imagen: 'Imagenes/parvularia.jpg',
      requisitos: ['Partida de nacimiento original', 'Copia de DUI de padres', 'Cartilla de vacunación']
    },
    { 
      nivel: 'Primer Ciclo', 
      descripcion: 'Fortalecimiento de la lectoescritura, razonamiento lógico-matemático y descubrimiento del entorno natural y social.', 
      color: '#2F5D8C', 
      imagen: 'Imagenes/primerciclo.jpg',
      requisitos: ['Certificado de parvularia', 'Ficha de salud', 'Fotos tamaño cédula']
    },
    { 
      nivel: 'Segundo Ciclo', 
      descripcion: 'Desarrollo de habilidades de pensamiento crítico, comprensión lectora avanzada y bases sólidas en ciencias y matemáticas.',
      color: '#2F5D8C', 
      imagen: 'Imagenes/segundociclo.jpg',
      requisitos: ['Certificado de primer ciclo', 'Ficha de salud actualizada', 'Fotos tamaño cédula']
    },
    { 
      nivel: 'Tercer Ciclo',
      descripcion: 'Etapa de transición hacia la adolescencia con énfasis en la autonomía académica, proyectos científicos y formación en valores ciudadanos.',
      color: '#1E3A5F', 
      imagen: 'Imagenes/tercerciclo.jpg',
      requisitos: ['Certificado de segundo ciclo', 'Ficha de salud actualizada', 'Fotos tamaño cédula']
    },
    { 
      nivel: 'Bachillerato General',
      descripcion: 'Dos años de preparación intensiva orientada a la educación superior, con un currículo integral en humanidades y ciencias exactas.',
      color: '#2F5D8C', 
      imagen: 'Imagenes/bachillerato.jpg',
      requisitos: ['Certificado de tercer ciclo', 'Ficha de salud actualizada', 'Fotos tamaño cédula', 'Certificado de estudios anteriores', 'Resultado de prueba AVANZO']
    },
    { 
      nivel: 'Bachillerato Técnico', 
      descripcion: 'Tres años de especialización profesional con competencias en desarrollo de software, mantenimiento de hardware y redes, ideal para el mundo laboral tecnológico.',
      color: '#2F5D8C',
      imagen: 'Imagenes/bachilleratotecnico.jpg',
      requisitos: ['Certificado de tercer ciclo', 'Ficha de salud actualizada', 'Fotos tamaño cédula', 'Certificado de estudios anteriores', 'Resultado de prueba AVANZO']
    }
  ];

  gradosSeleccionado: any = null;

  abrirRequisitos(grado: any) {
    if (this.gradosSeleccionado === grado) {
      this.gradosSeleccionado = null;
    } else {
      this.gradosSeleccionado = grado;
    }
  }
}