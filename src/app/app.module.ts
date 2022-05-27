import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { HomePageModule } from './home/home.module';
import { DatosComponent } from './perfil/datos/datos.component';
import { VistaComponent } from './perfil/vista/vista.component';
import { VistaTabsComponent } from './vista-tabs/vista-tabs.component';
import { NuevaPublicacionComponent } from './nueva-publicacion/nueva-publicacion.component';
import { PopoverPerfComponent } from './vista-tabs/popover-perf/popover-perf.component';

@NgModule({
  declarations: [AppComponent,
                DatosComponent,
                VistaComponent,
                VistaTabsComponent,
                NuevaPublicacionComponent,
                PopoverPerfComponent],
  entryComponents: [],
  imports: [
            HomePageModule,
            BrowserModule,
            IonicModule.forRoot(), 
            AppRoutingModule, 
            provideFirebaseApp(() => initializeApp(environment.firebase)), 
            provideAuth(() => getAuth()), 
            provideDatabase(() => getDatabase()), 
            provideStorage(() => getStorage()),
            FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}