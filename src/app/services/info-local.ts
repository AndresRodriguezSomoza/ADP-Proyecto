import { Injectable } from "@angular/core";

export interface InfoPagina {
  quienesSomos: string;
  mision: string;
  vision: string;
}

@Injectable({
  providedIn: 'root'
})

export class InfoLocal {
  private storageKey = 'infoPaginaPrincipal';
  
  private datosDefault: InfoPagina = {
    quienesSomos: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur diam et ante ullamcorper hendrerit. Duis convallis neque ut quam finibus, vel facilisis massa malesuada.',
    mision: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur diam et ante ullamcorper hendrerit. Duis convallis neque ut quam finibus, vel facilisis massa malesuada.',
    vision: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur diam et ante ullamcorper hendrerit. Duis convallis neque ut quam finibus, vel facilisis massa malesuada.'
  };

  constructor() { }

  obtenerInfo(): InfoPagina {
    const infoGuardada = localStorage.getItem(this.storageKey);
    if (infoGuardada) {
      return JSON.parse(infoGuardada);
    }
    return this.datosDefault;
  }

  guardarInfo(info: InfoPagina): void {
    localStorage.setItem(this.storageKey, JSON.stringify(info));
  }

  restaurarDefault(): void {
    localStorage.removeItem(this.storageKey);
  }
}

