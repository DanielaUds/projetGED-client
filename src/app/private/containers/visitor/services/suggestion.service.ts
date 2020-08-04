import { Injectable } from '@angular/core';
import { config } from '../../../../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  constructor(private http: HttpClient) {}

  async post(formData) {

    return await this.http.post(`${config.apiUrl}/suggestions`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map(data => data));
  }

  public async put(id: number, formData): Promise<any> {
    return await this.http
        .put(`${config.apiUrl}/suggestions/${id}`, formData)
        .pipe(map(data => data));
  }

  public get() {
    return this.http.get<any>(`${config.apiUrl}/suggestions/page`)
      .pipe(map(data => data));
  }

  public async delete(id) {
    return await this.http
        .delete(`${config.apiUrl}/suggestions/${id}`)
        .pipe(map(data => data));
  }

}
