import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './dashboard/users/users.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { DishesComponent } from './dashboard/dishes/dishes.component';
import { TablesComponent } from './dashboard/tables/tables.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {path: 'users', component: UsersComponent},
    {path: 'overview', component: OverviewComponent},
    {path: 'dishes', component: DishesComponent},
    {path: 'tables', component: TablesComponent},
    {path: '', redirectTo: 'overview', pathMatch: 'full'}
  ]},
  
]

@NgModule({
  declarations: [DashboardComponent, UsersComponent, OverviewComponent, DishesComponent, TablesComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    Ng2OrderModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModuleModule { }
