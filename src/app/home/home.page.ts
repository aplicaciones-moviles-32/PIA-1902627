import { Component } from '@angular/core';
import { LoginService } from '../servicios/login.service'
import { AuthErrorCodes } from 'firebase/auth';
import { Router } from '@angular/router'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(private auth: LoginService, private ruta: Router) {
    console.log("Aaaaaaaaaa");
   }

  mensajeError: boolean|string = false;

  mensajesError = {
    login: "Correo o contraseña incorrecta",
    registrar: "No se pudo registrar la cuenta",
    yaexiste: "Ese correo ya fue registrado",
    bloqueada: "Demasiados intentos fallidos: Cuenta bloqueada temporalmente"
  }

  usuario = {
    email: '',
    password: '',
  }

  login() {
    this.mensajeError = false;
    let promCred = this.auth.ingresarCorreoContrasena(this.usuario.email, this.usuario.password);
    promCred
    .then(res => {
      console.log(res);
      this.ruta.navigate(['/inicio']);
    })
    .catch(error => {
      const errorCode = error.code;
      if (errorCode == AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
        this.mensajeError = this.mensajesError.bloqueada;
      }
      else {
        this.mensajeError = this.mensajesError.login;
      }
      
      console.log(error);
    })
  }

  registrar() {
    this.mensajeError = false;
    let promCred = this.auth.registrarCorreoContrasena(this.usuario.email, this.usuario.password);
    promCred
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      const errorCode = error.code;
      if (errorCode == AuthErrorCodes.EMAIL_EXISTS) {
        this.mensajeError = this.mensajesError.yaexiste;
      }
      else {
        this.mensajeError = this.mensajesError.registrar;
      }
      console.log(error);
    })
  }
}
