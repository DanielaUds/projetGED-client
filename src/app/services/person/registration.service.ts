import { Injectable } from '@angular/core';
import { config } from '../../../../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  async post(formData): Promise<any> {
    return await this.http.post(`${config.apiUrl}/auth/persons/users`, formData).toPromise();
  }

  public get(url) {
    return this.http.get<any>(`${url}`)
      .pipe(map(data => data));
  }

}
