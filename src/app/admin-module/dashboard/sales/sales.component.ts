import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { RestService } from 'src/app/services/rest.service';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  orders: any = [];
  searchRecord: any;
  p: any;

  report: any = {
    name: null,
    phone: null,
    created_on: null,
    items: [],
    total_amount: null,
    loaded: false
  };

  dayActive: boolean = true;
  monthActive: boolean = false;
  yearActive: boolean = false;

    myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    sunHighlight: true,
    markCurrentDay: true,
    markCurrentMonth: true,
    markCurrentYear: true,
    monthSelector: true,
    yearSelector: true,
  };

  filterForm: FormGroup

  //  CHart configurations:
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    aspectRatio: 3,
    borderColor: "#bae755"
  };


  public barChartLabels = [];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    {
      data: [], label: '',
      borderColor: "#3C95D1",
      backgroundColor: "rgba(13, 93, 146, 0.4)",
      pointBackgroundColor: "#3C95D1"
    }
  ];

  chartData: any = [];


  constructor(private utils: UtilsService,
    private rest: RestService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.chartData = this.utils.getChartData();
    this.updateChartData('Days');


    window.setInterval(() => {
      this.chartData = this.utils.getChartData();
    }, 45000);

    this.rest.getLatestData().subscribe((res: any) => {
      this.orders = res;
    });

    this.filterForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });

  }


  changeChart(type: string) {

    this.resetStatus();
    if (type == 'Days') {
      this.dayActive = true;
    }
    else if (type == 'Months') {
      this.monthActive = true;
    }
    else {
      this.yearActive = true;
    }

    this.updateChartData(type);

  }


  resetStatus() {
    this.dayActive = false;
    this.monthActive = false;
    this.yearActive = false;
  }

  updateChartData(type) {

    if (this.chartData) {
      this.chartData.forEach(data => {

        if (type == data.type) {
          this.barChartLabels = data.labels;
          this.barChartData[0].label = data.type
          this.barChartData[0].data = data.data;
        }
      });

    }

  }


  filterOrders() {

    let dto = {
      start_date: this.filterForm.value.startDate.formatted,
      end_date: this.filterForm.value.endDate.formatted
    };

    this.rest.filterOrders(dto).subscribe((res: any) => {
      this.orders = res;
    },
    err => {
      this.orders = [];
    })
  }


  generateBill(item) {

    this.report = {
    name: null,
    phone: null,
    created_on: null,
    items: [],
    total_amount: null,
    loaded: false
  };
    
    this.rest.generateBill(item.order_id).subscribe((res: any) => {

      this.report.name = res.name;
      this.report.phone = res.phone;
      this.report.created_on = res.order_date;
      this.report.items = res.items;
      this.report.total_amount = res.total_amount
      this.report.loaded = true;
    });
    
    
  }

}
