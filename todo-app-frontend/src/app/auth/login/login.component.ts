import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonInput, IonButton, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule
  ]
})
export class LoginComponent implements OnInit {
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
    if (!this.email && !this.password) {
      this.commonService.presentToast('Please fill all fields corrctly', 'danger');
    }

    try {
      const res = await this.authService.login(this.email, this.password);
      this.commonService.presentToast(res.message);
    } catch (error: any) {
      console.error(error.error.error);
      this.commonService.presentToast(error.error.message, 'danger');
    }
  }

}
