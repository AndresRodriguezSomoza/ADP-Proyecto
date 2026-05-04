import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  telefono: string = '';
  correo: string = '';

  ngOnInit(): void {
    this.cargarDatosFooter();
  }

  cargarDatosFooter(): void {
    const telefonoGuardado = localStorage.getItem('footer_telefono');
    const correoGuardado = localStorage.getItem('footer_correo');
    
    this.telefono = telefonoGuardado || '+503 2229-9067';
    this.correo = correoGuardado || 'cewas2000@gmail.com';
  }
}