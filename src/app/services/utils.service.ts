import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loggedData: any;
  chartData: any;

  constructor() { }

  public setLoggedData(data) {
    this.loggedData = data;
  }

  public getLoggedData() {
    return this.loggedData;
  }

  public setLoggedStatus(status) {

    if (status) {
      sessionStorage.setItem("loginStatus", "Y");
    }
    else {
      sessionStorage.setItem("loginStatus", "N");
    }
  }

  public getLoggedStatus() {

    let status = sessionStorage.getItem("loginStatus");

    if(status == "Y") {
      return true;
    }
    else {
      return false;
    }
  }

  public setChartData(chart) {
    this.chartData = chart;
  }

  public getChartData() {
    return this.chartData;
  }
}
