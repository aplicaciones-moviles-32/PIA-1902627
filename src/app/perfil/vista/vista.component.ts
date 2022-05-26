import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servicios/login.service';
import { orderByKey, query, ref, Database, limitToLast, onValue} from '@angular/fire/database';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.scss'],
})
export class VistaComponent implements OnInit {

  constructor(private lgn: LoginService, private db: Database) { }

  ngOnInit() {
    this.ObtenerPublicacionesInicio();
  }

  ObtenerPublicacionesInicio() {
    let refPubs = query(ref(this.db,"publicacion/" + this.lgn.user.uid), limitToLast(20), orderByKey())
    return onValue(refPubs,snapshot => {
      console.log(snapshot);
    })
  }
}
