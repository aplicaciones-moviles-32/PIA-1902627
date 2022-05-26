import { Injectable } 
from '@angular/core';

import { Auth, signInWithEmailAndPassword, 
        createUserWithEmailAndPassword, 
        authState, signOut, User } from '@angular/fire/auth';

import { Database, set, ref } from '@angular/fire/database';

import { perfil } from '../modelos/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: Auth, private db: Database) {
   }

  ingresarCorreoContrasena(email: string, password:  string) {
      var credencial = signInWithEmailAndPassword(this.auth,email, password);
      return credencial;
  }

  registrarCorreoContrasena(email: string, password:  string) {
      var credencial = createUserWithEmailAndPassword(this.auth,email,password);
      return credencial;
  }

  cerrarSesion() {
    return signOut(this.auth);
  }

  crearUsuario(uid: string) {
    let refr = ref(this.db, 'usuario/' + uid);
    var perf: perfil = {
      nombre: '',
      bio: '',
      fotoperf: '',
    };
    return set(refr,perf);
  }

  obtenerUsuario() {
    return authState(this.auth);
  }
}
