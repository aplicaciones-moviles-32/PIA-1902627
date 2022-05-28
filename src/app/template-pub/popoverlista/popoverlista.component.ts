import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popoverlista',
  templateUrl: './popoverlista.component.html',
  styleUrls: ['./popoverlista.component.scss'],
})
export class PopoverlistaComponent implements OnInit {

  constructor(private controller: PopoverController) { }

  ngOnInit() {}

  async closeModal(datos: string) {
    await this.controller.dismiss(datos);
  }
}
