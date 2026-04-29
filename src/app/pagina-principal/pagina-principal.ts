import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [Navbar],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.css']
})
export class PaginaPrincipalComponent {

  scrollTop() {
    window.scrollTo(0, 0);
  }

}