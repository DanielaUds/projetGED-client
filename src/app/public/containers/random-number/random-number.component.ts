import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-random-number',
  templateUrl: './random-number.component.html',
  styleUrls: ['./random-number.component.css']
})
export class RandomNumberComponent implements OnInit {

  randomNumber: Observable<number>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    alert('Lecture des infos utilisateurs');
    console.log(this.authService.getUserInfos());
  }

  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/private/login']);
        }
      });
  }

}
