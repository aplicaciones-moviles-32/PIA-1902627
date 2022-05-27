import { Injectable } 
from '@angular/core';

import { Auth, signInWithEmailAndPassword, 
        createUserWithEmailAndPassword, 
        authState, signOut,User } from '@angular/fire/auth';
import { PopoverController } from '@ionic/angular';
import { Database, set, ref, push, update, remove } from '@angular/fire/database';
import { Storage, ref as stref, uploadBytes, UploadResult, deleteObject} from '@angular/fire/storage';
import { v4 } from 'uuid';
import { perfil, publicacion } from '../modelos/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user: null|User = null;

  constructor(private auth: Auth, private db: Database, private store: Storage) {
    authState(this.auth).subscribe(user => {
      this.user = user;
    })
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

  //Servicios de Base de datos
  async nuevaFoto(foto: string) {
    let resultado: null|UploadResult= null;
    let id = v4();
    let path = stref(this.store,"publicacion/" + this.user.uid + "/"+ id);
    //Obtiene foto
    let imagen = await fetch(foto).then(f=>f.blob());
    //Sube foto
    resultado =  await uploadBytes(path,imagen).then(res => res);
    return resultado;
  }

  async nuevaFotoPerfil(foto: string) {
    let resultado: null|UploadResult = null;
    let path = stref(this.store,"fotosPerf/" + this.user.uid + "/foto");
    //Obtiene foto
    let imagen = await fetch(foto).then(f=>f.blob());
    //Sube foto
    resultado =  await uploadBytes(path,imagen).then(res => res);
    return resultado;
  }

  modificarDatos(nNombre: string, nDesc: string, nFoto: string) {
    let path= ref(this.db,"usuario/" + this.user.uid);
    if(nFoto) {
      return update(path,{bio: nDesc, nombre: nNombre, fotoperf: nFoto})
    }
    else {
      return update(path,{bio: nDesc, nombre: nNombre});
    }
  }

  async nuevaPublicacion(fotopath: string, descrip: string) {
    let pub: publicacion = {
      usuario: this.user.uid,
      imagen: fotopath,
      descripcion: descrip,
    }
    //Crea publicacion en publicaciones del perfil
    let path = ref(this.db,"publicacion/" + this.user.uid);
    let pubId = push(path);
    return set(pubId,pub);
  }

  eliminarPublicacion(usuario: string, pubId: string) {
    return remove(ref(this.db,"publicacion/" + usuario + "/" + pubId))
  }

  eliminarFotoStorage(usuario: string, pubId: string) {
    return deleteObject(stref(this.store,"publicacion/"+usuario + "/" + pubId));
  }
}
