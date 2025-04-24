import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
  ],
  providers: [ModalController]
})
export class LoginComponent implements OnInit {

  @Output() sendDataToParent: EventEmitter<string> = new EventEmitter<string>();

  otp = '';
  email = '';
  password = '';
  confirmPassword = '';
  passwordType = 'password';
  passwordIcon = 'eye-off';
  isForget = false;
  showPasswordInputs = false;
  passwordError = false;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
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

  forgetToLogin() {
    this.isForget = false;
  }

  forgetPassword() {
    this.isForget = true;
  }

  async sendOtp(): Promise<void> {
    this.commonService.presentLoading();
    try {
      const res = await this.authService.sendResetPasswordOtp(this.email);
      this.showPasswordInputs = true;
      this.commonService.dismissLoading();
      this.commonService.presentToast(res.message);
    } catch (error: any) {
      if (error && error.error.message) {
        console.error(error.error.error);
        this.commonService.presentToast(error.error.message, 'danger');
        this.commonService.dismissLoading();
      } else {
        this.commonService.presentToast('An unexpected error occurred. Please try again.', 'danger');
        this.commonService.dismissLoading();
      }
    }
  }

  async forget(): Promise<void> {
    this.commonService.presentLoading();
    if (this.password && this.password.length < 6 && !this.otp) {
      this.passwordError = true;
      this.commonService.dismissLoading();
      this.commonService.presentToast('Please fill all fields corrctly', 'danger');
    }

    if (this.password === this.confirmPassword) {
      try {
        const res = await this.authService.resetPassword(this.password, this.otp);
        this.commonService.presentToast(res.message);
        if (res.success) {
          this.isForget = false
          this.commonService.dismissLoading();
        }
        this.resetForm();
      } catch (error: any) {
        console.error(error.error.error);
        this.commonService.dismissLoading();
        this.commonService.presentToast(error.error.message, 'danger');
      }
    } else {
      this.commonService.dismissLoading();
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
