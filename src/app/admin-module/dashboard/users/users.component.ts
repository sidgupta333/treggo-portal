import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchRecord: any;
  p: any;
  usersList: any = [];
  modalTitle: string = '';
  addForm: FormGroup;
  userId: any = null;

  constructor(private rest: RestService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.getAllUsers();

    this.addForm = this.formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      isAdmin: ['', Validators.compose([Validators.required])]
    })
  }


  getAllUsers() {

    this.usersList = [];

    //Get list of users
    this.rest.getAllUsers().subscribe(res => {
      this.usersList = res;
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch users details',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }


  // Create new user:
  addUser() {

    this.addForm.patchValue({
      fullName: '',
      username: '',
      password: '',
      isAdmin: ''
    })
    this.modalTitle = 'Add New User'
    this.userId = null;
  }


  saveUser() {
    // Save User
    let dto = {
      full_name: this.addForm.value.fullName,
      is_admin: this.addForm.value.isAdmin,
      password: this.addForm.value.password,
      username: this.addForm.value.username,
      user_id: null
    };

    if(this.userId != null) {
      dto.user_id = this.userId;
    }
    else {
      delete dto.user_id;
    }

    this.rest.createUser(dto).subscribe((res) => {
      Swal.fire({
        title: 'Success!',
        text: 'User created Successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.getAllUsers();
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'User Creation Failed',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })

  }


  editUser(item) {
    this.userId = null;
    this.modalTitle = 'Edit User';
    this.addForm.patchValue({
      fullName: item.full_name,
      username: item.username,
      password: '',
      isAdmin: item.is_admin,
    });

    this.userId = item.user_id;
  }


  deleteUser(item) {

    // Can't delete the last admin user:
    let adminCount = 0;
    this.usersList.forEach(element => {
      if (element.is_admin == 'Y') {
        adminCount++;
      }
    });

    if (adminCount == 1) {
      Swal.fire({
        title: 'Error!',
        text: 'You cannot delete the last ADMIN user!',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      return;
    }

    Swal.fire({
      title: 'Please Confirm!',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then((isConfirm) => {

      if (isConfirm.value) {
        this.rest.deleteUser(item.user_id).subscribe((res) => {
          this.getAllUsers();
          Swal.fire({
            title: 'Success!',
            text: 'User deleted Successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
          err => {
            Swal.fire({
              title: 'Error!',
              text: 'User Deletion failed',
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

}
