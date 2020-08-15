import { Injectable } from '@angular/core';
import { config } from '../../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) {}

  public findByTrackId(track_id: string) {
    let id = parseInt(track_id);
    return this.http.get<any>(`${config.apiUrl}/folders/track/${id}`).toPromise();
  }

  public find(id: string) {
    return this.http.get<any>(`${config.apiUrl}/folders/${id}`).toPromise();
  }

  public get() {
    return this.http.get<any>(`${config.apiUrl}/folders`).toPromise();
  }

  public getPourcentage(formData: any): Promise<any> {
    return this.http.post<any>(`${config.apiUrl}/folders/pourcent`, formData).toPromise();
  }

  public getUserFolders(user_id: number) {
    return this.http.get<any>(`${config.apiUrl}/folders/user/${user_id}`).toPromise();
  }

  public getUserAcceptedFolders(user_id: number) {
    return this.http.get<any>(`${config.apiUrl}/folders/user/status/accepted/${user_id}`).toPromise();
  }

  public getUserPendingFolders(user_id: number) {
    return this.http.get<any>(`${config.apiUrl}/folders/user/status/pending/${user_id}`).toPromise();
  }

  public getUserRejectedFolders(user_id: number) {
    return this.http.get<any>(`${config.apiUrl}/folders/user/status/rejected/${user_id}`).toPromise();
  }

  public getUserArchivedFolders(user_id: number) {
    return this.http.get<any>(`${config.apiUrl}/folders/user/status/archived/${user_id}`).toPromise();
  }

  post(formData): Promise<any> {
    return this.http.post(`${config.apiUrl}/folders`, formData).toPromise();
  }

  public put(id: number, formData): Promise<any> {
    return this.http.post(`${config.apiUrl}/folders`, formData,
    {
      reportProgress: true,
      observe: 'events'
    }).toPromise()
  }

}
