import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonLabel, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle, IonItem, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonButton, IonItem, IonCardTitle, IonCardContent, IonCardSubtitle, IonCardHeader, IonLabel, IonCard, FormsModule, CommonModule]

})
export class SignupComponent implements OnInit {

  email = '';
  otp = '';
  password = '';
  confirmPassword = '';
  name = '';

  showOtpInput = false;
  showPasswordInputs = false;
  otpError = false;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  sendOtp() {
    this.showOtpInput = true;
    // Simulate OTP sending logic here
  }

  verifyOtp() {
    if (this.otp === '123456') { // Replace with actual OTP validation logic
      this.otpError = false;
      this.showPasswordInputs = true;
      this.presentToast('Verified email');
    } else {
      this.otpError = true;
    }
  }

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  async signup() {
    if (this.password.length >= 6 && this.password === this.confirmPassword) {
      // Handle the signup logic here
      this.presentToast('New account registered');
      this.resetForm();
    } else {
      this.presentToast('Passwords do not match or are too short', 'danger');
    }
  }

  resetForm() {
    this.email = '';
    this.otp = '';
    this.password = '';
    this.confirmPassword = '';
    this.name = '';
    this.showOtpInput = false;
    this.showPasswordInputs = false;
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}
