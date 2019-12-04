import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    sunHighlight: true,
    markCurrentDay: true,
    markCurrentMonth: true,
    markCurrentYear: true,
    monthSelector: true,
    yearSelector: true,
    minYear: new Date().getFullYear(),
  };

  searchRecord: any;
  p: any;
  bannersList: any = [];
  modalTitle: string = '';
  addForm: FormGroup;
  imgUrl: string = null;
  fileError: boolean = false;
  order: string = 'banner_id';


  constructor(private rest: RestService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.addForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      uploadImage: [null, Validators.required]
    });

    this.setDate();
    this.getAllBanners();
  }


  getAllBanners() {

    this.bannersList = [];

    //Get list of banners:
    this.rest.getBanners().subscribe((res: any) => {
      this.bannersList = res;
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch banners details',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }


  // OPen add banner modal:
  addBanner() {
    this.fileError = false;

    this.addForm.patchValue({
      uploadImage: null
    });

    this.setDate();
    this.modalTitle = 'Add New Banner'
  }


  saveBanner() {

    // Save uploaded image first:
    let imageFormData = new FormData();
    imageFormData.append("file", this.addForm.value.uploadImage);

    //Call API to upload image:
    this.rest.uploadImage(imageFormData).subscribe((res: any) => {

      //Image successfully uploaded:
      let startDate = this.addForm.value.startDate;
      let stringDate: string = startDate.date.year + '-' + startDate.date.month + '-' + startDate.date.day;

      let dto = {
        img_id: res.img_id,
        is_available: 'Y',
        start_date: stringDate
      };

      //Call API to save banner:
      this.rest.addBanner(dto).subscribe((res: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Banner saved successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getAllBanners();
      },
        err => {
          Swal.fire({
            title: 'Error!',
            text: 'Unable to create new banner',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        })

    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Unable to upload image',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });

  }


  deleteBanner(banner) {

    Swal.fire({
      title: 'Please Confirm!',
      text: 'Are you sure you want to delete this banner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then((isConfirm) => {

      if (isConfirm.value) {
        this.rest.deleteBanner(banner.banner_id).subscribe(() => {
          this.getAllBanners();
          Swal.fire({
            title: 'Success!',
            text: 'Banner deleted Successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
          err => {
            Swal.fire({
              title: 'Error!',
              text: 'Banner Deletion failed',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
      }
      else {
        return;
      }
    });
  }


  toggleChanged(banner) {

    let dto = {
      banner_id: banner.banner_id,
      status: null
    };

    dto.status = banner.is_available == "Y" ? "N" : "Y";

    this.rest.updateBannerStatus(dto).subscribe((res) => {
      Swal.fire({
        title: 'Success!',
        text: 'Availability Status Updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.getAllBanners();

    },

    err => {
      Swal.fire({
        title: 'Error!',
        text: 'Availability Status Updated successfully',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      this.getAllBanners();

    });
  }



  viewImage(banner) {
    this.imgUrl = this.rest.getImageUrl(banner.banner_id);
  }

  // File select for Add Modal
  onSelectedFile = (event) => {

    let selectedFile = event.target.files[0];

    let extension = selectedFile.name.split('.')[1];

    if (extension.toLowerCase() == 'jpeg' || extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'png') {

      this.fileError = false;

      this.addForm.patchValue({
        uploadImage: selectedFile
      });

      console.log(this.addForm)
    }

    else {
      this.fileError = true;
    }

  }


  setDate() {
    // Set today date using the patchValue function
    let date = new Date();
    this.addForm.patchValue({
      startDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

}
