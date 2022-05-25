import { Injectable } 
from '@angular/core';

import { Auth, signInWithEmailAndPassword, 
        createUserWithEmailAndPassword, 
        authState, signOut } 
from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: Auth) {
   }

  ingresarCorreoContrasena(email: string, password:  string) {
      var credencial = signInWithEmailAndPassword(this.auth,email, password);
      return credencial;
  }

  registrarCorreoContrasena(email: string, password:  string) {
      var credencial = createUserWithEmailAndPassword(this.auth,email,password)
      return credencial;
  }

  obtenerUsuario() {
    return authState(this.auth);
  }

  cerrarSesion() {
    return signOut(this.auth);
  }
}
