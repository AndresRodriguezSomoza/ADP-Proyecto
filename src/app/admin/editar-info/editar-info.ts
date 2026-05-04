import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InfoLocal, InfoPagina } from '../../services/info-local';

@Component({
  selector: 'app-editar-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-info.html',
  styleUrls: ['./editar-info.css']
})
export class EditorInfo implements OnInit {
  private fb = inject(FormBuilder);
  private infoLocal = inject(InfoLocal);
  
  infoForm: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  
  errorQuienesSomos: string = '';
  errorMision: string = '';
  errorVision: string = '';

  contadorQuienesSomos: number = 0;
  contadorMision: number = 0;
  contadorVision: number = 0;
  
  maxLength: number = 500;

  constructor() {
    this.infoForm = this.fb.group({
      quienesSomos: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength)]],
      mision: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength)]],
      vision: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength)]]
    });
  }

  ngOnInit(): void {
    this.cargarInformacion();
    this.escucharCambios();
  }

  escucharCambios(): void {
    this.infoForm.get('quienesSomos')?.valueChanges.subscribe(value => {
      this.contadorQuienesSomos = value?.length || 0;
      this.validarCampoQuienesSomos();
    });
    
    this.infoForm.get('mision')?.valueChanges.subscribe(value => {
      this.contadorMision = value?.length || 0;
      this.validarCampoMision();
    });
    
    this.infoForm.get('vision')?.valueChanges.subscribe(value => {
      this.contadorVision = value?.length || 0;
      this.validarCampoVision();
    });
  }

  validarCampoQuienesSomos(): void {
    const control = this.infoForm.get('quienesSomos');
    if (control?.invalid && control?.touched) {
      if (control?.errors?.['required']) {
        this.errorQuienesSomos = '❌ Este campo es requerido';
      } else if (control?.errors?.['minlength']) {
        this.errorQuienesSomos = '❌ Mínimo 10 caracteres';
      } else if (control?.errors?.['maxlength']) {
        this.errorQuienesSomos = `❌ Máximo ${this.maxLength} caracteres`;
      }
    } else {
      this.errorQuienesSomos = '';
    }
  }

  validarCampoMision(): void {
    const control = this.infoForm.get('mision');
    if (control?.invalid && control?.touched) {
      if (control?.errors?.['required']) {
        this.errorMision = '❌ Este campo es requerido';
      } else if (control?.errors?.['minlength']) {
        this.errorMision = '❌ Mínimo 10 caracteres';
      } else if (control?.errors?.['maxlength']) {
        this.errorMision = `❌ Máximo ${this.maxLength} caracteres`;
      }
    } else {
      this.errorMision = '';
    }
  }

  validarCampoVision(): void {
    const control = this.infoForm.get('vision');
    if (control?.invalid && control?.touched) {
      if (control?.errors?.['required']) {
        this.errorVision = '❌ Este campo es requerido';
      } else if (control?.errors?.['minlength']) {
        this.errorVision = '❌ Mínimo 10 caracteres';
      } else if (control?.errors?.['maxlength']) {
        this.errorVision = `❌ Máximo ${this.maxLength} caracteres`;
      }
    } else {
      this.errorVision = '';
    }
  }

  limpiarMensajes(): void {
    setTimeout(() => {
      this.mensajeExito = '';
      this.mensajeError = '';
    }, 3000);
  }

  cargarInformacion(): void {
    const info = this.infoLocal.obtenerInfo();
    this.infoForm.patchValue({
      quienesSomos: info.quienesSomos,
      mision: info.mision,
      vision: info.vision
    });
    this.contadorQuienesSomos = info.quienesSomos?.length || 0;
    this.contadorMision = info.mision?.length || 0;
    this.contadorVision = info.vision?.length || 0;
  }

  guardarCambios(): void {
    this.infoForm.get('quienesSomos')?.markAsTouched();
    this.infoForm.get('mision')?.markAsTouched();
    this.infoForm.get('vision')?.markAsTouched();
    
    this.validarCampoQuienesSomos();
    this.validarCampoMision();
    this.validarCampoVision();
    
    if (this.infoForm.valid) {
      const infoActualizada: InfoPagina = {
        quienesSomos: this.infoForm.value.quienesSomos.trim(),
        mision: this.infoForm.value.mision.trim(),
        vision: this.infoForm.value.vision.trim()
      };
      
      this.infoLocal.guardarInfo(infoActualizada);
      this.mensajeExito = '✅ Información guardada exitosamente';
      this.mensajeError = '';
      this.limpiarMensajes();
    } else {
      this.mensajeError = '❌ Corrige los errores antes de guardar';
      this.limpiarMensajes();
    }
  }
}