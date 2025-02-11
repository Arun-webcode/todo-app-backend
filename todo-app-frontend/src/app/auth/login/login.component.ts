import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonLabel,
    IonInput, IonButton, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule, RouterModule
  ]
})
export class LoginComponent implements OnInit {

  @Output() sendDataToParent: EventEmitter<string> = new EventEmitter<string>();

  email = '';
  password = '';
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    public routerLink: RouterLink,
    public commonService: CommonService,
    public authService: AuthService
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
}
