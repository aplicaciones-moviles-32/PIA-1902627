import { Component, OnInit } from '@angular/core';
import { Database } from '@angular/fire/database';
import { LoginService } from '../servicios/login.service';

@Component({
  selector: 'app-nueva-publicacion',
  templateUrl: './nueva-publicacion.component.html',
  styleUrls: ['./nueva-publicacion.component.scss'],
})
export class NuevaPublicacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  //Submit
  crearPublicacion() {
    //Obtiene usuario
      //Sube foto
      //Crea publicación
  }
}
