import { Component, OnInit } from '@angular/core';
import { LoginService } from '../servicios/login.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-nueva-publicacion',
  templateUrl: './nueva-publicacion.component.html',
  styleUrls: ['./nueva-publicacion.component.scss'],
})
export class NuevaPublicacionComponent implements OnInit {

  constructor(private sanit: DomSanitizer, private login: LoginService) { }

  ngOnInit() {}

  fotourl: null|string = null;
  descripcion: string = "";
  mensaje: string = "";

  async tomarFoto() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90,
        width: 480,
      });
      this.fotourl = capturedPhoto.webPath;
    }
    catch(error) {
      console.log("Foto cancelada");
    }
  }

  //Submit
  crearPublicacion() {
    if(this.fotourl) {
      this.mensaje = "Cargando: Creando publicación...";
      //Sube foto
        this.login.nuevaFoto(this.fotourl)
        .then (res => {
          //Crea publicacion con referencia a la foto
          return this.login.nuevaPublicacion(res.metadata.fullPath,this.descripcion)
        })
        .then( res2 => {
          this.mensaje = "Tu publicación ha sido creada exitosamente";
        }).catch(error=>{
          console.log(error);
          this.mensaje = "Hubo un error al crear la publicación";
        })
    }
    else {
      this.mensaje = "Alerta: Necesitas escoger una foto";
    }
  }

  //Poner en el estilo de la foto para omitir seguridad
  omitirSeguridad(url: string) {
    return this.sanit.bypassSecurityTrustUrl(url);
  }
}
