import { Component, OnInit } from '@angular/core';
import { LoginService } from '../servicios/login.service';
import { PopoverController } from '@ionic/angular';
import { PopoverPerfComponent } from './popover-perf/popover-perf.component';
import { onValue, Database, ref } from '@angular/fire/database';
import { Storage,ref as stref,getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-tabs',
  templateUrl: './vista-tabs.component.html',
  styleUrls: ['./vista-tabs.component.scss'],
})
export class VistaTabsComponent implements OnInit {

  constructor(private log: LoginService, private pop: PopoverController, private db: Database, private str: Storage, private rutas: Router) { }

  ngOnInit() {
    this.obtenerFoto();
  }

  fotoPerf = "assets/foto-pred.jpg";
  
  async presentPopover(ev: any) {
    const popover = await this.pop.create({
      component: PopoverPerfComponent,
      event: ev,
      translucent: true
    });
    await popover.present();
    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  desuscribir: any = null;

  obtenerFoto() {
    this.log.obtenerUsuario().subscribe( user => {
      if(user) {
        let refr = ref(this.db,"usuario/" + user.uid);
        this.desuscribir = onValue(refr, perf => {
          if(perf.val().fotoperf) {
            getDownloadURL(stref(this.str,perf.val().fotoperf)).then(url => {
              this.fotoPerf = url;})
          }
        });
      }
      else{ if(this.desuscribir) {this.desuscribir();} }
    })
  };

  quitarparams() {
    this.rutas.navigate(['/inicio'], {queryParams: {userId: 'me'}});
  }
}
