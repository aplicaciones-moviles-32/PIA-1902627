import { Component } from '@angular/core';
import { LoginService } from './servicios/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //Carga el inicio si ya inició sesión
  constructor(private log: LoginService, private ruta: Router) {
    /*
    log.obtenerUsuario().subscribe(user => {
      if(!user) {
        ruta.navigate(['/auth']);
      }
    })*/
  }
}
