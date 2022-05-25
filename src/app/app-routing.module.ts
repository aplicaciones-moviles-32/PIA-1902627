import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoHalladoComponent } from './no-hallado/no-hallado.component';
import { VistaTabsComponent } from './vista-tabs/vista-tabs.component';

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
  { path: 'inicio', component: VistaTabsComponent},
  { path: '**', component: NoHalladoComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
