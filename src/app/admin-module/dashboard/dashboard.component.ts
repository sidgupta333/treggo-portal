import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  activeClasses: any = [];
  tenant: string;
  loggedInTime: any = new Date().toLocaleTimeString();
  constructor(private utils: UtilsService,
    private router: Router,
    private rest: RestService) { }

  ngOnInit() {

    this.tenant = sessionStorage.getItem('tenant');

    this.loadChartData();

    //Default selected settings
    for (let i = 1; i < 8; i++) {
      this.activeClasses.push(false);
    }

    if (sessionStorage.getItem('submenu')) {
      this.navigateSubMenu(sessionStorage.getItem('submenu'));
    }
    else {
      this.navigateSubMenu('overview');
    }

    window.setInterval(() => {
      this.loadChartData();
    }, 45000);
  }

  loadChartData() {
    this.rest.getChartsData().subscribe((res: any) => {
      this.utils.setChartData(res);
    });
  }


  //Sub menu navigation
  navigateSubMenu(subMenu: string) {
    if (subMenu == 'overview') {
      sessionStorage.setItem('submenu', 'overview');
      this.defaultClasses();
      this.activeClasses[0] = true;
      this.router.navigate(['dashboard', 'overview']);
    }

    else if (subMenu == 'users') {
      sessionStorage.setItem('submenu', 'users');
      this.defaultClasses();
      this.activeClasses[1] = true;
      this.router.navigate(['dashboard', 'users']);
    }

    else if (subMenu == 'dishes') {
      sessionStorage.setItem('submenu', 'dishes');
      this.defaultClasses();
      this.activeClasses[2] = true;
      this.router.navigate(['dashboard', 'dishes']);
    }
    else if (subMenu == 'tables') {
      sessionStorage.setItem('submenu', 'tables');
      this.defaultClasses();
      this.activeClasses[3] = true;
      this.router.navigate(['dashboard', 'tables']);
    }
    else if (subMenu == 'banners') {
      sessionStorage.setItem('submenu', 'banners');
      this.defaultClasses();
      this.activeClasses[4] = true;
      this.router.navigate(['dashboard', 'banners']);
    }

    else if (subMenu == 'coupons') {
      sessionStorage.setItem('submenu', 'coupons');
      this.defaultClasses();
      this.activeClasses[5] = true;
      this.router.navigate(['dashboard', 'coupons']);
    }

    else if (subMenu == 'sales') {
      sessionStorage.setItem('submenu', 'sales');
      this.defaultClasses();
      this.activeClasses[6] = true;
      this.router.navigate(['dashboard', 'sales']);
    }
  }

  // Remove all active options
  defaultClasses() {
    for (let i = 0; i < 8; i++) {
      this.activeClasses[i] = false;
    }
  }

  // Logout user:
  logout() {

    this.utils.setLoggedStatus(false);
    sessionStorage.removeItem('submenu');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('name');
    sessionStorage.setItem('tenant', null);
    this.router.navigate(['']);

  }

}
