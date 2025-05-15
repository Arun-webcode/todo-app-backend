import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLabel, IonHeader, IonContent, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonContent, IonHeader, IonLabel,
    IonInput, IonButton, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule, RouterModule
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

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() { }

  forgetToLogin() {
    this.router.navigate(['login']);
  }

  async sendOtp(): Promise<void> {
    await this.commonService.presentLoading();
    try {
      const res = await this.authService.sendResetPasswordOtp(this.email);
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
        const res = await this.authService.resetPassword(this.password, this.otp);
        this.commonService.presentToast(res.message);
        if (res.success) {
          this.router.navigate(['login']);
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
