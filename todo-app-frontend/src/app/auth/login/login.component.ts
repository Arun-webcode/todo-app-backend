import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ResetComponent } from './reset/reset.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonLabel,
    IonInput, IonButton, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule, RouterModule, IonicModule
  ]
})
export class LoginComponent implements OnInit {

  @Output() sendDataToParent: EventEmitter<string> = new EventEmitter<string>();

  email = '';
  password = '';
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    private routerLink: RouterLink,
    private commonService: CommonService,
    private authService: AuthService,
    private modelCtrl: ModalController
  ) { }

  ngOnInit() { }

  async login() {
    try {
      const res = await this.authService.login(this.email, this.password);
      this.commonService.presentToast(res.message);
    } catch (error: any) {
      console.error(error.error.error);
      this.commonService.presentToast(error.error.message, 'danger');
    }
  }

  goToLogin() {
    this.sendDataToParent.emit("true");
  }

  async forgetPassword() {
    const modal = await this.modelCtrl.create({
      component: ResetComponent,
      componentProps: {
        working: 'reset'
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }
}
