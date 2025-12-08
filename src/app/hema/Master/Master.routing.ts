

import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { EmployeeComponent } from "./employee/employee.component";
import { LeaveComponent } from "./leave/leave.component";
import { LoginComponent } from "./login/login.component";
import { EmployeeAdressComponent } from "./employee-adress/employee-adress.component";
import { GatepassComponent } from "./gatepass/gatepass.component";
import { authGuard } from "../Au/auth.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportEmployeeComponent } from "./report-employee/report-employee.component";
import { GatepassAprroveComponent } from "./gatepass-aprrove/gatepass-aprrove.component";
import { LeaveApproveComponent } from "./leave-approve/leave-approve.component";
import { BarComponent } from "./bar/bar.component";
import { ComparisionComponent } from "./comparision/comparision.component";
import { StatusComponent } from "./status/status.component";

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
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'employee', component: EmployeeComponent },
      { path: 'adress', component: EmployeeAdressComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'gate', component: GatepassComponent },
      { path: 'report', component: ReportEmployeeComponent },
      {path:'bar',component:BarComponent},
      {path:'comparision',component:ComparisionComponent},
      {path:'status',component:StatusComponent},
      { path: '', redirectTo: 'employee', pathMatch: 'full' },
      
    ],
  },

  // ✅ ADMIN DASHBOARD (SEPARATE)
  {
    path: 'admine',
    loadComponent: () =>
      import('./dashboard-admine/dashboard-admine.component').then(
        (m) => m.DashboardAdmineComponent
      ),
    canActivate: [authGuard],
    children: [
      { path: 'leaveapprove', component: LeaveApproveComponent },
      { path: 'passapprove', component: GatepassAprroveComponent },
      { path: '', redirectTo: 'leaveapprove', pathMatch: 'full' },
    ],
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterRouting { }