import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  async put(id: number, formData): Promise<any> {
    return await this.http.post(`${config.apiUrl}/persons/users/${id}`, formData).toPromise();
  }

  public findByUserUType(id: number) {
    return this.http.get<any>(`${config.apiUrl}/persons/user-utypes/user/${id}`).toPromise();
  }

  public get(url) {
    return this.http.get<any>(`${url}`)
      .pipe(map(data => data));
  }

}
