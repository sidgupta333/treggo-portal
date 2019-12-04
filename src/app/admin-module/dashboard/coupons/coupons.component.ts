import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';


@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  searchRecord: any;
  p: any;
  couponsList: any = [];
  addForm: FormGroup;

  constructor(private rest: RestService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.getAllCoupons();

    this.addForm = this.formBuilder.group({
      couponName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      couponDesc: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      couponPercentage: ['', Validators.compose([Validators.maxLength(3)])],
      maxDiscount: ['', Validators.required]
    });
  }


  defaultValues() {
    this.addForm.patchValue({
      couponName: '',
      couponDesc: '',
      couponPercentage: null,
      maxDiscount: null
    });
  }


  getAllCoupons() {
    this.couponsList = [];

    this.rest.getAllCoupons().subscribe((res: any) => {
      this.couponsList = res;
    });
  }


  saveCoupon() {

    let dto = {
      coupon_name: this.addForm.value.couponName,
      desc: this.addForm.value.couponDesc,
      max_discount: this.addForm.value.maxDiscount,
      percentage_discount: this.addForm.value.couponPercentage
    };

    //Save the new coupon:
    this.rest.createCoupon(dto).subscribe((res) => {

      this.getAllCoupons();
      this.defaultValues();

      Swal.fire({
        title: 'Success!',
        text: 'Coupon created Successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Coupon Creation Failed',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }


  deleteCoupon(couponId) {

    Swal.fire({
      title: 'Please Confirm!',
      text: 'Are you sure you want to delete this coupon?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then((isConfirm) => {

      if (isConfirm.value) {
        this.rest.deleteCoupon(couponId).subscribe(res => {

          this.getAllCoupons();

          Swal.fire({
        title: 'Success!',
        text: 'Coupon deleted Successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

        }, err => {
          Swal.fire({
          title: 'Error!',
          text: 'Coupon Deletion Failed',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        });
      }
      else {
        return;
      }
    });
  }
}
