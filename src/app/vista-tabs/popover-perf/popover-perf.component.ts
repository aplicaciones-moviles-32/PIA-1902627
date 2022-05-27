import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servicios/login.service';
@Component({
  selector: 'app-popover-perf',
  templateUrl: './popover-perf.component.html',
  styleUrls: ['./popover-perf.component.scss'],
})
export class PopoverPerfComponent implements OnInit {

  constructor(private login: LoginService) { }

  ngOnInit() {}

  logout() {
    this.login.cerrarSesion();
  }
}
