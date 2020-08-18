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

  public getListFoldersPending(service_id: number) {
    return this.http.get<any>(`${config.apiUrl}/services/listFoldersPending/${service_id}`).toPromise(); 
  }

  public getListFoldersByService(service_id: number) {
    return this.http.get<any>(`${config.apiUrl}/services/listFoldersByService/${service_id}`).toPromise(); 
  }

  public getListFoldersFinish(service_id: number, admin_id: number) {
    return this.http.get<any>(`${config.apiUrl}/services/listFoldersFinish/${service_id}/${admin_id}`).toPromise();
  }

  public getListFoldersRejected(service_id: number, admin_id: number) {
    return this.http.get<any>(`${config.apiUrl}/services/listFoldersRejected/${service_id}/${admin_id}`).toPromise();
  } 

  public getListFoldersAcceptedByService(service_id: number) {
    console.log(service_id);
    return this.http.get<any>(`${config.apiUrl}/services/listFoldersAcceptedByService/${service_id}`).toPromise();
  } 

  public approuvedFolderByService(current_activity_instance_id: number) {
    console.log(current_activity_instance_id);
    return this.http.get<any>(`${config.apiUrl}/activity_instances/create_next_activity/${current_activity_instance_id}`).toPromise();
  } 

  public rejectFolderByService(activity_instance_id: number) {
    console.log(activity_instance_id);
    return this.http.get<any>(`${config.apiUrl}/activity_instances/reject_folder/${activity_instance_id}`).toPromise();
  }
  
  public acceptedForTreatementFolder(current_activity_instance_id: number) {
    return this.http.get<any>(`${config.apiUrl}/activity_instances/onTakeForTreatementFolder/${current_activity_instance_id}`).toPromise();
  } 

  post(formData): Promise<any> {
    return this.http.post(`${config.apiUrl}/folders`, formData).toPromise();
  }

  public detailsPageFolder(id: number) {
    return this.http.get<any>(`${config.apiUrl}/folders/${id}/files`).toPromise();
  } 

  public put(id: number, formData): Promise<any> {
    return this.http.post(`${config.apiUrl}/folders`, formData,
    {
      reportProgress: true,
      observe: 'events'
    }).toPromise()
  }

}
