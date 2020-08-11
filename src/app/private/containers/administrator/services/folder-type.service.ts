import { Injectable } from '@angular/core';
import { config } from '../../../../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FolderTypeService {

  constructor(private http: HttpClient) {}

  public get() {
    return this.http.get<any>(`${config.apiUrl}/folders/folder_types/file_types`).toPromise();
  }

}
