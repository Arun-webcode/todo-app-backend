import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonHeader, IonContent, IonToolbar, IonTitle, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { Constants } from 'src/app/config/constants';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonTitle, IonToolbar, IonContent, IonHeader,
    IonInput, IonButton, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule, RouterModule, ThemeToggleComponent
  ],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.email = '';
    this.password = '';
    this.passwordType = 'password';
    this.passwordIcon = 'eye-off';
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async login() {
    try {
      const res = await this.authService.login(this.email, this.password);
      this.commonService.presentToast(res.message);
      await this.storageService.setItem(Constants.USER_LOGIN, res.success);
      await this.storageService.setItem(Constants.USER_EMAIL, res.user.email);
      await this.storageService.setItem(Constants.USER_NAME, res.user.name);
      await this.storageService.setItem(Constants.USER_ID, res.user._id);
      await this.storageService.setItem(Constants.AUTH_TOKEN, res.token);
      this.router.navigate(['home']);
    } catch (error: any) {
      console.error(error.error.message);
      this.commonService.presentToast(error.error.message, 'danger');
    }
  }

  async goToSignup() {
    this.router.navigate(['signup']);
  }

  forgetPassword() {
    this.router.navigate(['reset-password']);
  }
}
