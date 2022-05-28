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
      if(user) {
        if(!this.user_target_id || this.user_target_id == 'me') {
          this.user_target_id = user.uid;
        }
        //Actualiza cada que hay cambio en publicaciones del usuario
        this.desuscribir = onValue(ref(this.db,"publicacion/" + this.user_target_id), datos => {
          this.Publicaciones = [];
          datos.forEach(child => {
            let el: elemento = {key: child.key, value: child.val()};
            this.Publicaciones.push(el);
          })
          this.Publicaciones.reverse();
          this.obtenerFotos();
        })
      }
      else {
        //Deja de buscar actualizaciones cuando se cierra sesión
        if(this.desuscribir) {this.desuscribir();}
      }
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
}

export interface elemento {
  key: string,
  value: publicacion
}