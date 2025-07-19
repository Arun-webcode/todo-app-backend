import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrls, Constants } from '../config/constants';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  async getToken() {
    return await this.storageService.getItem(Constants.AUTH_TOKEN);
  }

  async sendOtp(email: string): Promise<any> {
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.otpGen}`, { email }).toPromise();
  }

  async registerAccount(email: string, password: string, name: string, otp: string): Promise<any> {
    const body = { email, password, name, otp };
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.register}`, body).toPromise();
  }

  async sendResetPasswordOtp(email: string): Promise<any> {
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.resetOtp}`, { email }).toPromise();
  }

  async resetPassword(email: string, newPassword: string, otp: string): Promise<any> {
    const body = { email, otp, newPassword };
    return this.http.put(`${this.baseUrl}${ApiUrls.auth.resetPass}`, body).toPromise();
  }

  async login(email: string, password: string): Promise<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}${ApiUrls.auth.login}`, body, {
      withCredentials: true
    }).toPromise();

  }

  async logout(): Promise<any> {
    return this.http.get(`${this.baseUrl}${ApiUrls.auth.logout}`, {
      withCredentials: true
    }).toPromise();
  }

  async deleteAccount(password: string): Promise<any> {
    const body = { password };

    return this.http.request('delete', `${this.baseUrl}${ApiUrls.auth.deleteAcc}`, {
      body,
      withCredentials: true
    }).toPromise();
  }

  async updateProfile(name: string, bio: string): Promise<any> {
    const body = { name, bio };
    return this.http.put(`${this.baseUrl}${ApiUrls.profileUpdate}`, body, {
      withCredentials: true
    }).toPromise();
  }

  async getUserDetails(): Promise<any> {
    return this.http.get(`${this.baseUrl}${ApiUrls.auth.getUserDetails}`, {
      withCredentials: true
    }).toPromise();
  }
}
