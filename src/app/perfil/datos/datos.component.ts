import { Component, OnInit } from '@angular/core';
import { onValue, ref, Database, DatabaseReference } from '@angular/fire/database';
import { LoginService } from '../../servicios/login.service'
import { perfil } from 'src/app/modelos/interfaces';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})
export class DatosComponent implements OnInit {

  constructor(private db: Database, private log: LoginService) {}
  ngOnInit() {
    this.obtenerdatos();
  }

  desuscribir: any = null;

  datos: perfil = {
    nombre: "",
    bio: "",
    fotoperf: "",
  }

  obtenerdatos() {
    //Se suscribe a la obtención de usuario
    this.log.obtenerUsuario().subscribe(user => {
      if(user) {
        let refr = ref(this.db,"usuario/" + user.uid);
        //Crea observador que muestra cada que se actualizan los datos
        this.desuscribir = onValue(refr, perf => {
          let datos = perf.val();
          this.datos = datos;
          console.log(datos);
      })}
      else {
        if(this.desuscribir) {
          this.desuscribir();
      }}}
  )}
}
