import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class InternationalizationService {

  constructor(private translate: TranslateService) {}

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
