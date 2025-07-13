import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrls, Constants } from 'src/app/config/constants';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  async getToken() {
    return await this.storageService.getItem(Constants.AUTH_TOKEN);
  }

  getAllTasks(): Observable<any> {
    return this.http.get(ApiUrls.task.getAllTasks);
  }

  async createTask(task: any): Promise<any> {
    return this.http.post(`${this.baseUrl}${ApiUrls.task.createTask}`, task).toPromise();
  }

  updateTask(taskId: string, task: any): Observable<any> {
    return this.http.put(ApiUrls.task.updateTaskByTaskid.replace(':id', taskId), task);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(ApiUrls.task.deleteTaskByTaskid.replace(':id', taskId));
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get(ApiUrls.task.getTaskByUserid.replace(':id', taskId));
  }
}
