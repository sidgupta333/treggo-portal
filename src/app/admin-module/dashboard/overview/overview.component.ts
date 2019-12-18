import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {


  //  CHart configurations:
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    aspectRatio: 3,
    borderColor: "#bae755"
  };


  public barChartLabels = ['2019-12-10', '2019-12-11', '2019-12-12', '2019-12-13', '2019-12-14', '2019-12-15', '2019-12-16'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    {data: [1164, 0, 0, 0, 0, 1332, 0], label: 'Sales per Day', 
    borderColor: "#3C95D1",
    backgroundColor: "rgba(13, 93, 146, 0.4)",
    pointBackgroundColor: "#3C95D1"}
  ];


  ordersList: any = [];
  searchRecord: any;
  p: any;
  dishesList: any = [];
  quantitiesList: any = [];
  constructor(private rest: RestService) { }

  ngOnInit() {

    this.updateStatusTable();

    window.setInterval(() => {
      this.updateStatusTable();
    }, 10000);
  }


  updateStatusTable() {
    this.rest.getDrilldown().subscribe((res: any) => {
      this.ordersList = res;
    });
  }


  selectOrder(item: any) {
    this.dishesList = item.dishes;
    
    this.quantitiesList = item.quantities;
  }


  prepareOrder(item: any) {

    let dto = {
      status: "PREPARING",
      subOrderId: item.sub_order_id
    };

    this.rest.updateSubOrder(dto).subscribe((res: any) => {
      this.updateStatusTable();
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Unable to update status',
          icon: 'error',
          confirmButtonText: 'OK'

        });
      });
  }



  completeOrder(item: any) {
    let dto = {
      status: "COMPLETED",
      subOrderId: item.sub_order_id
    };

    this.rest.updateSubOrder(dto).subscribe((res: any) => {
      this.updateStatusTable();
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Unable to update status',
          icon: 'error',
          confirmButtonText: 'OK'

        });
      });
  }



  closeOrder(item: any) {
    let dto = {
      status: "CLOSED",
      subOrderId: item.sub_order_id
    };

    this.rest.updateSubOrder(dto).subscribe(res => {

      this.updateStatusTable();

      let dto2 = {
        status: "CLOSED",
        order_id: item.order_id
      };

      this.rest.updateOrder(dto2).subscribe(res => {

        this.updateStatusTable();
      });
    }, err => {
      Swal.fire({
          title: 'Error!',
          text: 'Unable to update status',
          icon: 'error',
          confirmButtonText: 'OK'

        });
    });

  }

}
