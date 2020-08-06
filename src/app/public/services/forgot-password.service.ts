import { Injectable } from '@angular/core';
import { config } from '../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) {}

  post(formData) {
    return this.http.post(`${config.apiUrl}/persons/users/reset-password`, formData, {
      reportProgress: true,
      observe: 'events'
    }).toPromise();
  }

  
}
