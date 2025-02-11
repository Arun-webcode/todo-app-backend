import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardHeader, IonCardSubtitle, IonCardContent,
  IonCardTitle, IonButton, IonInput, IonLabel
} from '@ionic/angular/standalone';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [IonLabel,
    IonInput, IonButton, IonCardTitle, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule
  ]
})
export class SignupComponent implements OnInit {

  @Output() sendDataToParent: EventEmitter<string> = new EventEmitter<string>();

  email = '';
  otp = '';
  password = '';
  confirmPassword = '';
  name = '';

  passwordError = false;
  showPasswordInputs = false;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    private authService: AuthService,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this.sendDataToParent.emit("false");
  }

  async sendOtp(): Promise<void> {
    this.commonService.presentLoading();
    if (!this.email || this.email.trim() === '') {
      this.commonService.presentToast('Please enter a valid email address.', 'danger');
      this.showPasswordInputs = false;
      this.commonService.dismissLoading();
      return;
    }
    try {
      const res = await this.authService.sendOtp(this.email);
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

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'password' ? 'eye-off' : 'eye';
  }

  async signup(): Promise<void> {
    this.commonService.presentLoading();
    if (this.password && this.password.length < 6 && !this.otp && !this.name) {
      this.passwordError = true;
      this.commonService.dismissLoading();
      this.commonService.presentToast('Please fill all fields corrctly', 'danger');
    }

    if (this.password === this.confirmPassword) {
      try {
        const res = await this.authService.registerAccount(this.password, this.name, this.otp);
        this.commonService.presentToast(res.message);
        if (res.success) {
          this.sendDataToParent.emit("false");
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
    this.name = '';
    this.showPasswordInputs = false;
  }
}
