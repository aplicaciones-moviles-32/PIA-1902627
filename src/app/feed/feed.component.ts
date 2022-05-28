import { Component, OnInit } from '@angular/core';
import { Database, get, ref } from '@angular/fire/database';
import { publicacion } from '../modelos/interfaces';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {

  constructor(private db: Database) { }

  ngOnInit() {
    this.obtenerFeed();
  }

  Publicaciones = []; 

  obtenerFeed() {
    get(ref(this.db,'feed')).then( snap=> {
      let feedlista = snap.val();
      for(const pubref in feedlista) {
        get(ref(this.db,feedlista[pubref].path)).then( val=> {
          console.log({key: val.key,value: val.val()});
          this.Publicaciones.push({key: val.key,value: val.val()})
        })
      }
    })
  }
}
