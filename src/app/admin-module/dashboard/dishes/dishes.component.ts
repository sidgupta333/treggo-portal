import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RestService } from 'src/app/services/rest.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {

  p: any;
  dishesHierarchy: any = [];
  dishForm: FormGroup;
  dishForm2: FormGroup;
  categoryForm: FormGroup;
  dishId: any = null;
  categoryId: any = null;

  fileError: boolean = false;


  constructor(private rest: RestService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.updateData()

    this.dishForm = this.formBuilder.group({
      dishName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      dishPrice: ['', Validators.compose([Validators.required])],
      dishCategory: ['', Validators.compose([Validators.required])],
      uploadImage: ['', Validators.compose([Validators.required])],
    })


    this.dishForm2 = this.formBuilder.group({
      dishName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      dishPrice: ['', Validators.compose([Validators.required])],
      dishCategory: ['', Validators.compose([Validators.required])],
      uploadImage: [''],
    })

    this.categoryForm = this.formBuilder.group({
      categoryName: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });

  }


  updateData() {

    //Get list of all dishes with categories
    this.rest.getAllDishesWithCategories().subscribe((res) => {
      this.dishesHierarchy = res;
    });

  }

  toggleChanged(dish) {

    let dto = {
      dish_Id: dish.dish_id,
      status: null
    };

    dto.status = dish.is_available == "Y" ? "N" : "Y";

    this.rest.updateDishStatus(dto).subscribe((res) => {

      Swal.fire({
        title: 'Success!',
        text: 'Availability Status Updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.updateData();

    })
  }

  addDIshModalOpen() {
    this.dishForm.patchValue({
      dishName: null,
      dishPrice: null,
      dishCategory: null,
      uploadImage: null
    });

    this.dishId = null;
    this.fileError = false;
  }


  //Method which is called whenever dish is updated:
  updateDishClicked(category, dish) {

    this.dishForm2.patchValue({
      dishName: dish.dish_name,
      dishPrice: dish.base_price,
      dishCategory: category.category_id.toString(),
      uploadImage: ''
    });

    this.dishId = dish.dish_id;
    this.fileError = false;
  }


  // Update existing dish details
  updateDishDetails() {

    if (this.dishForm2.value.uploadImage == '') {

      let dto = {
        dish_id: this.dishId,
        base_price: this.dishForm2.value.dishPrice,
        category_id: Number(this.dishForm2.value.dishCategory),
        dish_name: this.dishForm2.value.dishName,
        img_id: null,
        is_available: 'Y'
      };

      this.callSaveDishService(dto);
    }

    else {

      //Image is updated:
      let imageFormData = new FormData();
      imageFormData.append("file", this.dishForm2.value.uploadImage);

      //Call API to upload image:
      this.rest.uploadImage(imageFormData).subscribe((res: any) => {

        let dto = {
          dish_id: this.dishId,
          base_price: this.dishForm2.value.dishPrice,
          category_id: Number(this.dishForm2.value.dishCategory),
          dish_name: this.dishForm2.value.dishName,
          img_id: res.img_id,
          is_available: 'Y'
        };

        this.callSaveDishService(dto);

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
  }

  // Add new dish
  addDish() {

    //Upload image:
    let imageFormData = new FormData();
    imageFormData.append("file", this.dishForm.value.uploadImage);

    //Call API to upload image:
    this.rest.uploadImage(imageFormData).subscribe((res: any) => {

      //After uploading image, save the dish to DB:
      let dto = {
        base_price: this.dishForm.value.dishPrice,
        category_id: Number(this.dishForm.value.dishCategory),
        dish_name: this.dishForm.value.dishName,
        img_id: res.img_id,
        is_available: 'Y'
      }

      this.callSaveDishService(dto);

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


  callSaveDishService(dto) {

    this.rest.saveDish(dto).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'Dish saved successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.updateData();
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Unable to create new dish',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }


  // Delete existing dish:
  deleteDish = (dish) => {

    Swal.fire({
      title: 'Please Confirm!',
      text: 'Are you sure you want to delete this dish?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then((isConfirm) => {

      if (isConfirm.value) {

        this.rest.deleteDish(dish.dish_id).subscribe(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Dish deleted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.updateData();

        }, err => {
          Swal.fire({
            title: 'Error!',
            text: 'Unable to delete the dish',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        })
      }
    })
  }


  // File select for Add Modal
  onSelectedFile = (event) => {

    let selectedFile = event.target.files[0];

    let extension = selectedFile.name.split('.')[1];

    if (extension.toLowerCase() == 'jpeg' || extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'png') {

      this.fileError = false;

      this.dishForm.patchValue({
        uploadImage: selectedFile
      });

      console.log(this.dishForm)
    }

    else {
      this.fileError = true;
    }

  }

  // File select for Update Modal
  onSelectedFile2 = (event) => {

    let selectedFile = event.target.files[0];

    let extension = selectedFile.name.split('.')[1];

    if (extension.toLowerCase() == 'jpeg' || extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'png') {

      this.fileError = false;

      this.dishForm2.patchValue({
        uploadImage: selectedFile
      });

      console.log(this.dishForm)
    }

    else {
      this.fileError = true;
    }

  }



  // Category logic:

  openCategoryModal() {

    this.categoryForm.patchValue({
      categoryName: ''
    });

    this.categoryId = null;
  }


  updateCategory(category) {
    this.categoryForm.patchValue({
      categoryName: category.category_name
    });

    this.categoryId = category.category_id;
  }


  saveDishCategory() {

    // Update case
    if (this.categoryId) {

      this.rest.createCategory(this.categoryForm.value.categoryName, this.categoryId).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Category updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        this.updateData();
      },
        err => {
          Swal.fire({
            title: 'Error!',
            text: 'Unable to update Category',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }

    else {
      this.rest.createCategory(this.categoryForm.value.categoryName, 0).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Category created successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        this.updateData();
      },
        err => {
          Swal.fire({
            title: 'Error!',
            text: 'Unable to create Category',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  }


  deleteCategory(categoryId) {

    
    Swal.fire({
      title: 'Please Confirm!',
      text: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then((isConfirm) => {

      if (isConfirm.value) {

        this.rest.deleteCategory(categoryId).subscribe(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Category deleted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.updateData();

        }, err => {
          Swal.fire({
            title: 'Error!',
            text: 'Unable to delete category',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        })
      }
    })
  }


}
