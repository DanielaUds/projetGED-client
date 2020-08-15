import { Injectable } from '@angular/core';
import { config } from '../../../../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FolderService1 {

  constructor(private http: HttpClient) {}

  post(formData): Promise<any> {
    return this.http.post(`${config.apiUrl}/folders`, formData).toPromise();
  }
}
