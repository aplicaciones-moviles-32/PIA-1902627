import { Component, OnInit } from '@angular/core';
import { perfil, publicacion } from '../modelos/interfaces';
import { Input } from '@angular/core';
import { getDownloadURL, ref as stref, Storage } from '@angular/fire/storage';
import { Database, get, ref, update} from '@angular/fire/database';
import { AlertController } from '@ionic/angular';
import { LoginService } from '../servicios/login.service';
import { Router } from '@angular/router';
import { PopoverlistaComponent } from './popoverlista/popoverlista.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-template-pub',
  templateUrl: './template-pub.component.html',
  styleUrls: ['./template-pub.component.scss'],
})
export class TemplatePubComponent implements OnInit {

  constructor(private Stre: Storage, private db: Database, private alert: AlertController, private log: LoginService, private ruta: Router, private Pop: PopoverController) { }

  ngOnInit() {
  }


  publicacionvar: publicacion = {
    usuario: "",
    imagen: "",
    descripcion: "",
  }

  datosPerf: perfil = {
    nombre: "",
    bio: "",
    fotoperf: "",
  }

  imagenMostrar: string = "assets/no-disponible.jpg";

  imagenUsuario: string ="assets/foto-pred.jpg";

  obtenerimagenpub() {
    if(this.publicacionvar.imagen) {
      getDownloadURL(stref(this.Stre,this.publicacionvar.imagen)).then(url =>{
        this.imagenMostrar = url;
    })}
  }

  obtenerdatosperf() {
    if(this.publicacionvar.usuario) {
      get(ref(this.db,"usuario/" + this.publicacionvar.usuario)).then(user=>{
        this.datosPerf = user.val();
        //obtiene foto de perfil
        if(this.datosPerf.fotoperf) {
           getDownloadURL(stref(this.Stre,this.datosPerf.fotoperf)).then(url => {
            this.imagenUsuario = url;})
        }})}
  }

  @Input() 
  key: string = "";

  @Input() 
  public set publicacion(value: publicacion) {
    if(value) {
      //Obtiene imagen de la publicación
      this.publicacionvar = value;
      this.obtenerimagenpub();
      this.obtenerdatosperf();
    }
  };
  
  //Funciones editar
  nuevadesc: string = "";
  editando = false;
  mensaje="";

  mostrarEdicion() {
    this.editando = true;
    this.nuevadesc = this.publicacionvar.descripcion;
  }

  cerrarEdicion() {
    this.editando = false;
    this.mensaje = "";
  }

  
  guardarEdicion() {
    this.mensaje = "Cargando cambios"
    let refr = ref(this.db,"publicacion/" + this.publicacionvar.usuario + "/" + this.key);
    update(refr,{descripcion: this.nuevadesc}).then(res => {
      this.mensaje = "Guardado con éxito"
    });
  }

  //Eliminar Publicación
  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Aviso',
      message: '¿Quiere eliminar esta publicación?',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarPublicacion();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
    ]
    });
    await alert.present();
  }

  eliminarPublicacion() {
    this.log.eliminarFotoStorage(this.publicacionvar.imagen);
    this.log.eliminarPublicacion(this.publicacionvar.usuario, this.key);
  }

  verPerfil() {
    this.ruta.navigate(['/inicio/perfil'], {queryParams: {userId: this.publicacionvar.usuario}});
  }

  async popover(ev: any) {
    const popover = await this.Pop.create({
      component: PopoverlistaComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
  
    let res = await popover.onDidDismiss();
    switch(res.data) {
      case 'eliminar':
        this.presentAlert();
        break;
      case 'editar':
        this.mostrarEdicion();
        break;
    }
  }
}
