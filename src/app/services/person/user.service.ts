import { Injectable } from '@angular/core';
import { config } from '../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  put(id: number, formData): Promise<any> {
    return this.http.post(`${config.apiUrl}/persons/users/${id}`, formData).toPromise();
  }

  getAvatar(user_id): Promise<any> {
    return this.http.get(`${config.apiUrl}/persons/users/avatar/${user_id}`).toPromise();
  }

  post(formData): Promise<any> {
    return this.http.post(`${config.apiUrl}/persons/users`, formData).toPromise();
  }

  public get(url) {
    return this.http.get<any>(`${url}`)
      .pipe(map(data => data));
  }

}
