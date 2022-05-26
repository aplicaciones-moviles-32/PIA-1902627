import { Component, OnInit } from '@angular/core';
import { LoginService } from '../servicios/login.service';

@Component({
  selector: 'app-vista-tabs',
  templateUrl: './vista-tabs.component.html',
  styleUrls: ['./vista-tabs.component.scss'],
})
export class VistaTabsComponent implements OnInit {

  constructor(private login: LoginService) { }

  ngOnInit() {}

  logout() {
    this.login.cerrarSesion();
  }
}
