import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  menuItems = [
    { nombre: 'Editar Info', icono: '✏️', ruta: '/admin/editar-info' },
    { nombre: 'Editar Grados', icono: '🎓', ruta: '/admin/editar-grados' },
    { nombre: 'Editar Imágenes', icono: '🖼️', ruta: '/admin/editar-imagenes' },
    { nombre: 'Editar Footer', icono: '📞', ruta: '/admin/editar-footer' }
  ];
}