import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

  searchRecord: any;
  p: any;
  tablesList: any = [];
  modalTitle: string = '';
  addForm: FormGroup;
  tableId: any = null;


  constructor(private rest: RestService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.getAllTables();

    this.addForm = this.formBuilder.group({
      deviceName: ['', Validators.compose([Validators.required])],
      tableNumber: ['', Validators.compose([Validators.required])]
    });
  }

  getAllTables() {

    this.tablesList = [];

    //Get list of tables
    this.rest.getAllTables().subscribe(res => {
      this.tablesList = res;
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch tables details',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }


  // Create new table:
  addTable() {

    this.addForm.patchValue({
      deviceName: '',
      tableNumber: ''
    });

    this.modalTitle = 'Add New Table'
    this.tableId = null;
  }


  saveTable() {

    // Save Table
    let dto = {
      device_id: this.addForm.value.deviceName,
      table_number: this.addForm.value.tableNumber,
      table_id: null
    };

    if (this.tableId != null) {
      dto.table_id = this.tableId;
    }

    else {
      delete dto.table_id;
    }

    this.rest.createNewTable(dto).subscribe((res) => {
      Swal.fire({
        title: 'Success!',
        text: 'Table created Successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.getAllTables();
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Table Creation Failed',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })

  }


  editTable(item) {
    this.tableId = null;
    this.modalTitle = 'Edit Table';
    this.addForm.patchValue({
      deviceName: item.device_id,
      tableNumber: item.table_number
    });

    this.tableId = item.table_id;
  };


  deleteTable(item) {

    Swal.fire({
      title: 'Please Confirm!',
      text: 'Are you sure you want to delete this table?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then((isConfirm) => {

      if (isConfirm.value) {
        this.rest.deleteTable(item.table_id).subscribe((res) => {
          this.getAllTables();
          Swal.fire({
            title: 'Success!',
            text: 'Table deleted Successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
          err => {
            Swal.fire({
              title: 'Error!',
              text: 'Table Deletion failed',
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
