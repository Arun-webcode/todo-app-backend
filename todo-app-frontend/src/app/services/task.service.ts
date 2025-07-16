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

  getAllTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}${ApiUrls.task.getAllTasks}`, { withCredentials: true });
  }

  async createTask(task: any): Promise<any> {
    return this.http.post(`${this.baseUrl}${ApiUrls.task.createTask}`, task, { withCredentials: true }).toPromise();
  }

  updateTask(taskId: string, task: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${ApiUrls.task.updateTaskByTaskid.replace(':id', taskId)}`, task, { withCredentials: true });
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${ApiUrls.task.deleteTaskByTaskid.replace(':id', taskId)}`, { withCredentials: true });
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${ApiUrls.task.getTaskByUserid.replace(':id', taskId)}`, { withCredentials: true });
  }
}
