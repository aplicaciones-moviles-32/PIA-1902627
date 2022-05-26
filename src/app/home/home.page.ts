import { Component } from '@angular/core';
import { LoginService } from '../servicios/login.service'
import { AuthErrorCodes } from 'firebase/auth';
import { Router } from '@angular/router'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(private auth: LoginService, private ruta: Router,public alertController: AlertController) {
    //Carga el inicio si ya inició sesión
    auth.obtenerUsuario().subscribe(user=> {
      if(user) {
        this.ruta.navigate(['/inicio']);
      }})
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

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Notificación',
      subHeader: '',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async login() {
    this.mensajeError = false;
    try {
      let cred = await this.auth.ingresarCorreoContrasena(this.usuario.email, this.usuario.password);
    }
    catch(error) {
      const errorCode = error.code;
      if (errorCode == AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
        this.mensajeError = this.mensajesError.bloqueada;
      }
      else {
        this.mensajeError = this.mensajesError.login;
      }
      console.log(error);
    }
  }

  async registrar() {
    this.mensajeError = false;
    try {
      let cred = await this.auth.registrarCorreoContrasena(this.usuario.email, this.usuario.password);
      try {
        await this.auth.crearUsuario(cred.user.uid);
        this.presentAlert("Usuario creado con éxito");
      }
      catch(error) {
        this.presentAlert("Hubo un error al crear el usuario, reportar al adminsitrador");
      }
    }
    catch(error) {
      const errorCode = error.code;
      if (errorCode == AuthErrorCodes.EMAIL_EXISTS) {
        this.mensajeError = this.mensajesError.yaexiste;
      }
      else {
        this.mensajeError = this.mensajesError.registrar;
      }
      console.log(error);
    }
  }
}
