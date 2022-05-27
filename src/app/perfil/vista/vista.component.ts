import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servicios/login.service';
import { ref, Database, onValue} from '@angular/fire/database';
import { Storage, getDownloadURL, ref as stref } from '@angular/fire/storage';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.scss'],
})
export class VistaComponent implements OnInit {

  constructor(private lgn: LoginService, private db: Database, private str: Storage) { }

  ngOnInit() {
    this.ObtenerPublicaciones();
  }

  Publicaciones = [];
  desuscribir: any = null;
  ultKey: string|null = null;
  imagenes = {};

  ObtenerPublicaciones() {
    //Actualiza cada que cambia el usuario
    this.lgn.obtenerUsuario().subscribe( user => { 
      if(user) {
        //Actualiza cada que hay cambio en publicaciones del usuario
        this.desuscribir = onValue(ref(this.db,"publicacion/" + user.uid), datos => {
          this.Publicaciones = [];
          datos.forEach(child => {
            let el = {key: child.key, value: child.val()};
            this.Publicaciones.push(el);
          })
          this.Publicaciones.reverse();
          this.obtenerFotos();
        })
      }
      else {
        //Deja de buscar actualizaciones cuando se cierra sesión
        if(this.desuscribir) {
          this.desuscribir();
        }
      }
    })
  }
  
  obtenerFotos() {
    this.Publicaciones.forEach( pub => {
      getDownloadURL(stref(this.str, pub.value.imagen)).then(url => {
        this.imagenes[pub.key] = url;
      })
    })
  }
}
