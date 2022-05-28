import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servicios/login.service';
import { ref, Database, onValue} from '@angular/fire/database';
import { Storage, getDownloadURL, ref as stref } from '@angular/fire/storage';
import { publicacion } from 'src/app/modelos/interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.scss'],
})
export class VistaComponent implements OnInit {

  constructor(private lgn: LoginService, private db: Database, private str: Storage, private ruta: ActivatedRoute) { }

  ngOnInit() {
    this.ruta.queryParamMap.subscribe(query=>{
      let user_param = query.get("userId");
      if(user_param) {
        this.user_target_id = user_param;
      }
      this.ObtenerPublicaciones();
    })
  }

  actualizar: boolean = true; //Se togle cada vez que se actualiza para actualizar al comp datos
  user_target_id: string = "";
  es_actual: boolean = false; //Es true si el usuario visto es el loggeado

  //Cada elemento de Publicaciones es de la forma {key, value: Publicacion}
  Publicaciones: elemento[] = [];
  desuscribir: any = null;
  ultKey: string|null = null;
  imagenes = {};

  ObtenerPublicaciones() {
    //Actualiza cada que cambia el usuario
    this.lgn.obtenerUsuario().subscribe( user => { 
      user ? this.callbackUsuario(user.uid) : this.desuscribir();
    })
  }
  
  callbackUsuario(userid) {
    if(!this.user_target_id || this.user_target_id == 'me') {
      this.user_target_id = userid;
    }

    //Actualiza cada que hay cambio en publicaciones del usuario
    this.desuscribir = 
    onValue(ref(this.db,"publicacion/" + this.user_target_id), 
      datos => {
        this.Publicaciones = [];
        datos.forEach(child => {this.Publicaciones.push({key: child.key, value: child.val()});})
        this.Publicaciones.reverse();
        this.obtenerFotos();
    })
  }

  obtenerFotos() {
    for(const pub of this.Publicaciones) {
      try {
        getDownloadURL(stref(this.str, pub.value.imagen))
        .then(url => {
          this.imagenes[pub.key] = url;
        })
      }
      catch(error) { 
        console.log(error);
      }
    }
  };

  //Recargar datos
  doRefresh(event) {
    this.callbackUsuario(this.user_target_id);
    this.actualizar = !this.actualizar;
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}

export interface elemento {
  key: string,
  value: publicacion
}