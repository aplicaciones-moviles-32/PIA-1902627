import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servicios/login.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-perf',
  templateUrl: './popover-perf.component.html',
  styleUrls: ['./popover-perf.component.scss'],
})
export class PopoverPerfComponent implements OnInit {

  constructor(private login: LoginService, private contr: PopoverController) { }

  ngOnInit() {}

  logout() {
    this.login.cerrarSesion();
    this.contr.dismiss();
  }
}
