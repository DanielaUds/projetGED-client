import { Injectable } from '@angular/core';
import { config } from '../../../../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  public async post(formData) {

    return await this.http.post(`${config.apiUrl}/users`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map(data => data));
  }

  public async put(id: number, formData): Promise<any> {
    return await this.http
        .put(`${config.apiUrl}/users/${id}`, formData)
        .pipe(map(data => data));
  }

  public async get() {
    return await this.http.get<any>(`${config.apiUrl}/users/page`)
      .pipe(map(data => data));
  }

  public async delete(id) {
    return await this.http
        .delete(`${config.apiUrl}/users/${id}`)
        .pipe(map(data => data));
  }

  public async search(field, q) {
    return await this.http.get<any>(`${config.apiUrl}/users?field=${field}&q=${q}`)
      .pipe(map(data => data));
  }

}
