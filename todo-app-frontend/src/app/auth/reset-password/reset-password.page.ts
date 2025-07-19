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
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonTitle, IonToolbar, IonContent, IonHeader,
    IonInput, IonButton, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule, RouterModule, ThemeToggleComponent
  ]
})
export class ResetPasswordPage implements OnInit {

  otp = '';
  email = '';
  password = '';
  confirmPassword = '';
  passwordType = 'password';
  passwordIcon = 'eye-off';
  showPasswordInputs = false;
  passwordError = false;
  isLogin = false;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.isLogin = await this.storageService.getItem(Constants.AUTH_TOKEN);
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  forgetToLogin() {
    if (this.isLogin) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['login']);
    }
  }

  async sendOtp(): Promise<void> {
    await this.commonService.presentLoading();
    try {
      const res = this.isLogin ? await this.authService.sendResetPasswordOtp(await this.storageService.getItem(Constants.USER_EMAIL)) : await this.authService.sendResetPasswordOtp(this.email);
      this.showPasswordInputs = true;
      await this.commonService.dismissLoading();
      this.commonService.presentToast(res.message);
    } catch (error: any) {
      if (error && error.error.message) {
        console.error(error.error.error);
        this.commonService.presentToast(error.error.message, 'danger');
        await this.commonService.dismissLoading();
      } else {
        this.commonService.presentToast('An unexpected error occurred. Please try again.', 'danger');
        await this.commonService.dismissLoading();
      }
    }
  }

  async forget(): Promise<void> {
    await this.commonService.presentLoading();
    if (this.password && this.password.length < 6 && !this.otp) {
      this.passwordError = true;
      await this.commonService.dismissLoading();
      this.commonService.presentToast('Please fill all fields corrctly', 'danger');
    }

    if (this.password === this.confirmPassword) {
      try {
        const res = this.isLogin ? await this.authService.resetPassword(await this.storageService.getItem(Constants.USER_EMAIL), this.password, this.otp) : await this.authService.resetPassword(this.email, this.password, this.otp);
        this.commonService.presentToast(res.message);
        if (res.success) {
          if (await this.storageService.getItem(Constants.AUTH_TOKEN)) {
            this.router.navigate(['home'], {
              replaceUrl: true
            });
          } else {
            this.router.navigate(['login']);
          }
          await this.commonService.dismissLoading();
        }
        this.resetForm();
      } catch (error: any) {
        console.error(error.error.error);
        await this.commonService.dismissLoading();
        this.commonService.presentToast(error.error.message, 'danger');
      }
    } else {
      await this.commonService.dismissLoading();
      this.commonService.presentToast('Passwords not matching or too short', 'danger');
    }
  }

  resetForm(): void {
    this.email = '';
    this.otp = '';
    this.password = '';
    this.confirmPassword = '';
    this.showPasswordInputs = false;
  }

}
