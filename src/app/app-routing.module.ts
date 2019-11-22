import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  {path: '',  component: LoginComponent},
  {path: 'dashboard', loadChildren: () => import('./admin-module/admin-module.module').then(m => m.AdminModuleModule)    , canActivateChild: [AuthGuard],
    canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
