import { Component, OnInit } from '@angular/core';
import { PopoverController, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-menu-popover',
  templateUrl: './user-menu-popover.component.html',
  styleUrls: ['./user-menu-popover.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, IonList]
})
export class UserMenuPopoverComponent implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() { }

  close(option: string) {
    this.popoverCtrl.dismiss(option);
  }
}
