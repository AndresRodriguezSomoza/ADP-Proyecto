import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

/**
 * Interfaz técnica que refleja la estructura de la tabla institucion_config en MySQL 8
 */
export interface InstitucionConfig {
  id_config: number;
  mision: string;
  vision: string;
  quienesSomos: string;
}

@Injectable({
  providedIn: "root",
})
export class InstitucionService {
  // URL Certificada para producción mediante Cloudflare Zero Trust
  private apiUrl = "http://localhost:8080/Backend-escuela-main/api/institucion";

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la información desde el backend en el Server-HP
   */
  getInstitucion(): Observable<InstitucionConfig> {
    return this.http.get<InstitucionConfig>(this.apiUrl);
  }

  /**
   * Envía las actualizaciones al backend de Java para persistir en MySQL
   */
  actualizarInstitucion(datos: InstitucionConfig): Observable<any> {
    return this.http.post(`${this.apiUrl}/actualizar`, datos);
  }
}
