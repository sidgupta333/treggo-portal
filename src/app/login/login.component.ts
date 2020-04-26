import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RestService } from '../services/rest.service';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {



loginForm: FormGroup;


  constructor(private formBuilder: FormBuilder,
    private restServices: RestService,
    private utils: UtilsService,
    private router: Router) { }


  ngOnInit() {

    sessionStorage.setItem('tenant', null);
    this.loginForm = this.formBuilder.group({
      tenantCode: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    })
  }


  login() {

    //Enter credentials and check user is valid or not:
    let dto = {
      tenant: this.loginForm.value.tenantCode,
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.restServices.loginUser(dto).subscribe((res: any) => {
   
        //Save user data to session storage for state management
        this.utils.setLoggedStatus(true);
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('name', res.fullName);
        sessionStorage.setItem('tenant', dto.tenant);

        // Set data to shared service
        this.utils.setLoggedData(res);
        this.utils.setLoggedStatus(true);

        // Navigate to dashboard
        if(res.is_admin == 'Y') {
          this.router.navigate(["dashboard"]);
        }

        else {
          this.router.navigate(['kitchen']);
        }

    },
    err => {

      this.loginForm.patchValue({
        username: '',
        password: ''
      });

      Swal.fire({
          title: 'Error!',
          text: 'Invalid Credentials',
          icon: 'error',
          confirmButtonText: 'OK'
        });
    });
  }
}
