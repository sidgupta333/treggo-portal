import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  private SERVER: string = "http://treggo-api.herokuapp.com";
  // private SERVER: string = "http://localhost:8080";

  LOGIN: string = "/users/login";
  ALL_USERS: string = "/users/getAll";
  CREATE_USER: string = "/users/create";
  DELETE_USER: string = "/users/deleteUser/";
  ALL_DISHES_CATEGORIES: string = "/dishes/dishes/categoriesAll";
  UPDATE_DISH_STATUS: string = "/dishes/updateDish/status";
  UPLOAD_IMAGE: string = "/images/upload";
  SAVE_NEW_DISH: string = "/dishes/createDish";
  DELETE_DISH: string = "/dishes/deleteDish/";
  CREATE_CATEGORY: string = "/dishes/createCategory/";
  DELETE_CATEGORY: string = "/dishes/deleteCategory/";
  GET_ALL_TABLES: string = "/tables/getAll";
  CREATE_TABLE: string = "/tables/create";
  DELETE_TABLE: string = "/tables/delete/";
  GET_ALL_BANNERS: string = "/banners/getAll";
  SAVE_BANNER: string = "/banners/create";
  DELETE_BANNER: string = "/banners/delete/";
  VIEW_IMAGE: string = "/images/download/banner/";
  UPDATE_BANNER_STATUS: string = "/banners/updateStatus";
  GET_ALL_COUPONS = "/coupons/getAll";
  CREATE_COUPON = "/coupons/create";
  DELETE_COUPON = "/coupons/delete/";
  GET_DRILLDOWN = "/subOrders/drillDown";
  UPDATE_SUB_ORDER = "/subOrders/updateStatus";
  UPDATE_ORDER = "/orders/updateStatus";
  CHARTS = "/orders/chart";
  LATEST_ORDERS = "/orders/latest";
  FILTER_ORDERS = "/orders/ordersByDate";
  GENERATE_BILL = "/orders/bill/";


  constructor(private http: HttpClient) { }




  // ---------------------------ALL API Endpoints here--------------------------------

  public loginUser(dto: any) {
    let url = this.SERVER.concat(this.LOGIN);
    return this.http.post(url, dto);
  }


  public getAllUsers() {
    let url = this.SERVER.concat(this.ALL_USERS);
    return this.http.get(url);
  }

  public createUser(dto: any) {
    let url = this.SERVER.concat(this.CREATE_USER);
    return this.http.post(url, dto)
  }

  public deleteUser(userId) {
    let url = this.SERVER.concat(this.DELETE_USER, userId);
    return this.http.delete(url);
  }

  public getAllDishesWithCategories() {
    let url = this.SERVER.concat(this.ALL_DISHES_CATEGORIES);
    return this.http.get(url);
  }

  public updateDishStatus(dto: any) {
    let url = this.SERVER.concat(this.UPDATE_DISH_STATUS);
    return this.http.post(url, dto);
  }

  public uploadImage(formGroup: FormData) {
    let url = this.SERVER.concat(this.UPLOAD_IMAGE);
    return this.http.post(url, formGroup);
  }

  public saveDish(dto: any) {
    let url = this.SERVER.concat(this.SAVE_NEW_DISH);
    return this.http.post(url, dto);
  }

  public deleteDish(dishId: any) {
    let url = this.SERVER.concat(this.DELETE_DISH, dishId);
    return this.http.delete(url);
  }

  public createCategory(categoryName: string, categoryId: any) {
    let url = this.SERVER.concat(this.CREATE_CATEGORY, categoryName, '/', categoryId);
    return this.http.get(url);
  }

  public deleteCategory(categoryId) {
    let url = this.SERVER.concat(this.DELETE_CATEGORY, categoryId);
    return this.http.delete(url);
  }

  public getAllTables() {
    let url = this.SERVER.concat(this.GET_ALL_TABLES);
    return this.http.get(url);
  }

  public createNewTable(dto: any) {
    let url = this.SERVER.concat(this.CREATE_TABLE);
    return this.http.post(url, dto);
  }

  public deleteTable(tableId) {
    let url = this.SERVER.concat(this.DELETE_TABLE, tableId);
    return this.http.delete(url);
  }

  public addBanner(dto: any) {
    let url = this.SERVER.concat(this.SAVE_BANNER);
    return this.http.post(url, dto);
  }

  public getBanners() {
    let url = this.SERVER.concat(this.GET_ALL_BANNERS);
    return this.http.get(url);
  }

  public deleteBanner(id: any) {
    let url = this.SERVER.concat(this.DELETE_BANNER, id);
    return this.http.delete(url);
  }

  public getImageUrl(id: any): string {
    let url: string = this.SERVER.concat(this.VIEW_IMAGE, id);
    return url;
  }

  public updateBannerStatus(dto: any) {
    let url = this.SERVER.concat(this.UPDATE_BANNER_STATUS);
    return this.http.post(url, dto);
  }

  public createCoupon(dto: any) {
    let url = this.SERVER.concat(this.CREATE_COUPON);
    return this.http.post(url, dto);
  }

  public getAllCoupons() {
    let url = this.SERVER.concat(this.GET_ALL_COUPONS);
    return this.http.get(url);
  }

  public deleteCoupon(id: any) {
    let url = this.SERVER.concat(this.DELETE_COUPON, id);
    return this.http.delete(url);
  }

  public getDrilldown() {
    let url = this.SERVER.concat(this.GET_DRILLDOWN);
    return this.http.get(url);
  }

  public updateSubOrder(dto: any) {
    let url = this.SERVER.concat(this.UPDATE_SUB_ORDER);
    return this.http.post(url, dto);
  }

  public updateOrder(dto: any) {
    let url = this.SERVER.concat(this.UPDATE_ORDER);
    return this.http.post(url, dto);
  }

  public getChartsData() {
    let url = this.SERVER.concat(this.CHARTS);
    return this.http.get(url);
  }

  public getLatestData() {
    let url = this.SERVER.concat(this.LATEST_ORDERS);
    return this.http.get(url);
  }

  public filterOrders(dto: any) {
    let url = this.SERVER.concat(this.FILTER_ORDERS);
    return this.http.post(url, dto);
  }

  public generateBill(order_id: any) {
    let url = this.SERVER.concat(this.GENERATE_BILL, order_id);
    return this.http.get(url);
  }

}
