import { Injectable } from '@angular/core';
import { config } from '../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class InternationalizationService {

  constructor(private http: HttpClient, private translate: TranslateService) {}

  updateLanguage(value: string, callback) {
    this.translate.getTranslation(value).subscribe((res: any) => {
      callback(res);
    });
  }

  changeLanguage(value, callback)   {
    this.translate.use(value);
    this.updateLanguage(value, callback);
    console.log('change language => ' + value);
  }
}
