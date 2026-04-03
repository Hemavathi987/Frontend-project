

import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { EmployeeComponent } from "./employee/employee.component";
import { LeaveComponent } from "./leave/leave.component";
import { LoginComponent } from "./login/login.component";
import { EmployeeAdressComponent } from "./employee-adress/employee-adress.component";
import { GatepassComponent } from "./gatepass/gatepass.component";
import { authGuard } from "../Au/auth.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GatepassAprroveComponent } from "./gatepass-aprrove/gatepass-aprrove.component";
import { LeaveApproveComponent } from "./leave-approve/leave-approve.component";
import { BarComponent } from "./bar/bar.component";
import { ComparisionComponent } from "./comparision/comparision.component";
import { StatusComponent } from "./status/status.component";
import { PDFComponent } from "./pdf/pdf.component";
import { SalaryCalculatorComponent } from "./salary-calculator/salary-calculator.component";
import { CheckMonthlySalaryComponent } from "./check-monthly-salary/check-monthly-salary.component";
import { ResignationComponent } from "./resignation/resignation.component";
import { CheckResignationComponent } from "./check-resignation/check-resignation.component";
import { BioDataComponent } from "./bio-data/bio-data.component";
import { KKKKKKComponent } from "../../kkkkkk/kkkkkk.component";


// const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   {
//     path: '',
//     component: DashboardComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: 'employee', component: EmployeeComponent },
//       { path: 'adress', component: EmployeeAdressComponent },
//       { path: 'leave', component: LeaveComponent },
//       { path: 'gate', component: GatepassComponent },
//       {path:'report',component:ReportEmployeeComponent},
//       {path:'admine',component:LeaveApproveComponent},
//       {path:'passapprove',component:GatepassAprroveComponent},
//       { path: '', redirectTo: 'employee', pathMatch: 'full' }
      
//     ]
//   }
// ];
const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // ✅ EMPLOYEE DASHBOARD
  {
    path: 'employee',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'employee', component: EmployeeComponent },
      { path: 'adress', component: EmployeeAdressComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'gate', component: GatepassComponent },
      { path: 'report', component: PDFComponent },
      {path:'bar',component:BarComponent},
      {path:'comparision',component:ComparisionComponent},
      {path:'status',component:StatusComponent},
      {path:'checksalary',component:CheckMonthlySalaryComponent},
      {path:'resign',component:ResignationComponent},
      { path: '', redirectTo: 'employee', pathMatch: 'full' },
    ],
  },

  // ✅ ADMIN DASHBOARD (SEPARATE)
  {
    path: 'admine',
    loadComponent: () =>// lazyloading
      import('./dashboard-admine/dashboard-admine.component').then(
        (m) => m.DashboardAdmineComponent
      ),
    canActivate: [authGuard],
    children: [
      { path: 'leaveapprove', component: LeaveApproveComponent },
      { path: 'passapprove', component: GatepassAprroveComponent },
       { path: 'resignapprove', component: CheckResignationComponent },
      {path: 'Salary',component:SalaryCalculatorComponent},
      {path:'bio',component:BioDataComponent},
       {path:'kkk',component:KKKKKKComponent},
      { path: '', redirectTo: 'bio', pathMatch: 'full' },
    ],
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterRouting { }