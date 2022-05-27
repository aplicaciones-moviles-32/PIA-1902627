import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Database, ref, get } from '@angular/fire/database';
import { publicacion } from '../modelos/interfaces';

@Component({
  selector: 'app-publicacion-detalle',
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.scss'],
})
export class PublicacionDetalleComponent implements OnInit {

  constructor(private route: ActivatedRoute, private db: Database) { }

  sub: any = null;
  usuarioId: string = "";
  publicacionId: string = "";
  publicacion: publicacion = {
    usuario: "",
    imagen: "",
    descripcion: "",
  }

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(params => {
      this.publicacionId = params.get("pubId");
      this.usuarioId = params.get("userId");
      this.obtenerPublicacionDetalle();
    })
  }

  obtenerPublicacionDetalle() {
    let refp = ref(this.db, "publicacion/"+this.usuarioId+"/"+this.publicacionId);
    get(refp).then(snap=> {
      this.publicacion = snap.val();
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
