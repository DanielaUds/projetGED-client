import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $;
@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss']
})
export class LeftSideComponent implements OnInit {

  isAuthenticated = false;
  subscription: Subscription;
  translations: any = null;
  activeMenu: any = {
    menu0: 1,
    menu1: 1
  };

  constructor(
    private router: Router) {
    }

  compute0() {
    this.activeMenu.menu0 === 1 ? this.activeMenu.menu0 = 0 : this.activeMenu.menu0 = 1;
  }

  compute1() {
    this.activeMenu.menu1 === 1 ? this.activeMenu.menu1 = 0 : this.activeMenu.menu1= 1;
  }

  showChildren(parent) {
    const uls = $(parent);
    if (!uls.hasClass('mm-show')) {
       uls.addClass('mm-show');
    } else {
      uls.removeClass('mm-show');
    }
  }
  ngOnInit() {
    console.log('Load data for component');
  }

  logout() {
    console.log('make logout here');
  }

  changeLanguage(value) {
    console.log('change language !');
  }

  goTo(component) {
    this.router.navigate(['/private/visitors/' + component]);
  }

}
