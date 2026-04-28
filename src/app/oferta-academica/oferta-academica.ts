import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-oferta-academica",
  imports: [],
  templateUrl: "./oferta-academica.html",
  styleUrl: "./oferta-academica.css",
})
export class OfertaAcademica {
listaGrados = [
  { nivel: 'Parvularia', descripcion: 'Enfoque en el desarrollo psicomotriz, social y afectivo de los más pequeños, sentando las bases del aprendizaje mediante el juego y valores.', color: '#1E3A5F', imagen: 'imagenes/parvularia.jpg' },
  { nivel: 'Primer Ciclo', descripcion: 'Fortalecimiento de la lectoescritura, razonamiento lógico-matemático y descubrimiento del entorno natural y social.', color: '#2F5D8C', imagen: 'imagenes/primerciclo.jpg' },
  { nivel: 'Segundo Ciclo', descripcion: 'Desarrollo de habilidades de pensamiento crítico, comprensión lectora avanzada y bases sólidas en ciencias y matemáticas.', color: '#2F5D8C', imagen: 'imagenes/segundociclo.jpg' },
  { nivel: 'Tercer Ciclo', descripcion: 'Etapa de transición hacia la adolescencia con énfasis en la autonomía académica, proyectos científicos y formación en valores ciudadanos.', color: '#1E3A5F', imagen: 'imagenes/tercerciclo.jpg' },
  { nivel: 'Bachillerato General', descripcion: 'Dos años de preparación intensiva orientada a la educación superior, con un currículo integral en humanidades y ciencias exactas.', color: '#2F5D8C', imagen: 'imagenes/bachillerato.jpg' },
  { nivel: 'Bachillerato Técnico', descripcion: 'Tres años de especialización profesional con competencias en desarrollo de software, mantenimiento de hardware y redes, ideal para el mundo laboral tecnológico.', color: '#2F5D8C', imagen: 'imagenes/bachilleratotecnico.jpg' }
];



}
