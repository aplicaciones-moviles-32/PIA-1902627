import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoHalladoComponent } from './no-hallado/no-hallado.component';
import { VistaTabsComponent } from './vista-tabs/vista-tabs.component';
import { VistaComponent } from './perfil/vista/vista.component';
import { NuevaPublicacionComponent } from './nueva-publicacion/nueva-publicacion.component';
import { FeedComponent } from './feed/feed.component';
import { PublicacionDetalleComponent } from './publicacion-detalle/publicacion-detalle.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  { path: 'inicio', component: VistaTabsComponent, children: [
      {path: "perfil", component: VistaComponent, pathMatch: 'full'},
      {path: "publicar", component: NuevaPublicacionComponent},
      {path: "feed", component: FeedComponent},
      {path: '', redirectTo: "perfil", pathMatch: 'full'}
  ]},
  { path: 'publicacion/:pubId/:userId', component: PublicacionDetalleComponent },
  { path: '**', component: NoHalladoComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
