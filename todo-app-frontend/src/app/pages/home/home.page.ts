import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg, IonCard, IonButton } from '@ionic/angular/standalone';
import { SignupComponent } from "../../auth/signup/signup.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonImg, IonContent, CommonModule, FormsModule, SignupComponent],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
