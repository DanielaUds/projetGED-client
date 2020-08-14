import { Injectable } from '@angular/core';
import { config } from '../../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {}

  public get(): Promise<any> {
    return this.http.get<any>(`${config.apiUrl}/services/all`).toPromise();
  }

}
