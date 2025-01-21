import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrls } from '../config/constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  async sendOtp(email: string): Promise<any> {
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.otpGen}`, { email }).toPromise();
  }

  async registerAccount(password: string, name: string, otp: string): Promise<any> {
    const body = { password, name, otp };
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.register}`, body).toPromise();
  }

  async sendResetPasswordOtp(email: string): Promise<any> {
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.resetOtp}`, { email }).toPromise();
  }

  async resetPassword(otp: string, newPassword: string): Promise<any> {
    const body = { otp, newPassword };
    return this.http.put(`${this.baseUrl}${ApiUrls.auth.resetPass}`, body).toPromise();
  }

  async login(email: string, password: string): Promise<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.login}`, body).toPromise();
  }

  async logout(): Promise<any> {
    return this.http.get(`${this.baseUrl}${ApiUrls.auth.logout}`).toPromise();
  }

  async deleteAccount(password: string): Promise<any> {
    const body = { password };
    return this.http.delete(`${this.baseUrl}${ApiUrls.auth.deleteAcc}`, { body }).toPromise();
  }
}
