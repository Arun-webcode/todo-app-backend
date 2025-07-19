import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-delete-account-modal',
  templateUrl: './delete-account-modal.component.html',
  styleUrls: ['./delete-account-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class DeleteAccountModalComponent implements OnInit {

  password: string = '';
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.password = '';
    this.passwordType = 'password';
    this.passwordIcon = 'eye-off';
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  dismiss(confirm = false) {
    if (confirm) {
      this.modalCtrl.dismiss({ password: this.password });
    } else {
      this.modalCtrl.dismiss(null);
    }
  }
}
