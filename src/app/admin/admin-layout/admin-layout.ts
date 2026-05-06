import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { NavbarAdmin } from '../navbar-admin/navbar-admin';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, NavbarAdmin],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {}