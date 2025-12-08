
import { LeaveComponent } from "./leave/leave.component";
import { EmployeeComponent } from "./employee/employee.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MasterRouting } from "./Master.routing";
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from "./login/login.component";
import { GatepassComponent } from "./gatepass/gatepass.component";
import { ReportEmployeeComponent } from "./report-employee/report-employee.component";
import { GatepassAprroveComponent } from "./gatepass-aprrove/gatepass-aprrove.component";
import { LeaveApproveComponent } from "./leave-approve/leave-approve.component";
import { BarComponent } from "./bar/bar.component";
import { ComparisionComponent } from "./comparision/comparision.component";
import { StatusComponent } from "./status/status.component";

@NgModule({
    declarations: [
 
    ],
    imports: [
        CommonModule,
        MasterRouting,
        LeaveComponent,
        EmployeeComponent ,DialogModule ,
       LoginComponent,
       GatepassComponent,
       ReportEmployeeComponent,
       LeaveApproveComponent,
       GatepassAprroveComponent,
       BarComponent,
       ComparisionComponent,
       StatusComponent

    ]
})
export class MasterModule { }