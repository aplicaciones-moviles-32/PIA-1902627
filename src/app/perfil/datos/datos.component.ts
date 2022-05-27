import { Component, OnInit } from '@angular/core';
import { onValue, ref, Database, DatabaseReference } from '@angular/fire/database';
import { LoginService } from '../../servicios/login.service'
import { perfil } from 'src/app/modelos/interfaces';
import { Storage, getDownloadURL, ref as stref } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})
export class DatosComponent implements OnInit {

  constructor(private db: Database, private log: LoginService, private str: Storage, private sanit: DomSanitizer) {}
  ngOnInit() {
    this.obtenerdatos();
  }

  desuscribir: any = null;

  datos: perfil = {
    nombre: "",
    bio: "",
    fotoperf: "",
  }

  fotodef: string = "assets/foto-pred.jpg";
  nuevoNombre: string = "";
  nuevaDesc: string = "";
  nuevafotoUrl: string = this.fotodef;

  editando: boolean = false;
  fotoPerf = "assets/foto-pred.jpg";

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
          if(datos.fotoperf) {
            this.obtenerFotoPerf().then(url => {
              this.fotoPerf = url;
            })
          }
      })}
      else {
        console.log("alguien cerró sesión");
        if(this.desuscribir) {
          this.desuscribir();
      }}}
  )}

  obtenerFotoPerf() {
    return getDownloadURL(stref(this.str,this.datos.fotoperf));
  }

  mostrarEdicion() {
    this.editando = true;
    this.nuevoNombre = this.datos.nombre;
    this.nuevaDesc = this.datos.bio;
  }

  cancelarEdicion() {
    this.editando = false;
  }

  async tomarFoto() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90,
        width: 480,
      });
      this.nuevafotoUrl = capturedPhoto.webPath;
    }
    catch(error) {
      console.log("Foto cancelada");
    }
  }

  omitirSeguridad(url: string) {
    return this.sanit.bypassSecurityTrustUrl(url);
  }

  async modificarDatos() {
    let fotoPath: string = "";
    if (this.nuevafotoUrl != this.fotodef) {
      await this.log.nuevaFotoPerfil(this.nuevafotoUrl).then(upld=> {
        fotoPath = upld.metadata.fullPath;
        console.log(fotoPath);
      });
    }
    this.log.modificarDatos(this.nuevoNombre, this.nuevaDesc, fotoPath);
    this.editando = false;
  }
}
