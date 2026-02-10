import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { AccordionModule } from "primeng/accordion";
import { ToastModule } from "primeng/toast";
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterGatePass } from '../../Service/gatepass';
import { GatePass } from '../../Model/Model';
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from "primeng/table";
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { formatDate } from '@angular/common';
import { retry } from 'rxjs';
import { LeaveComponent } from '../leave/leave.component';
import { LeaveApproveComponent } from "../leave-approve/leave-approve.component";
type EmployeeAction = 'VIEW' | 'STATUS';


@Component({
  selector: 'app-gatepass',
  standalone: true,
  imports: [ToolbarModule, CheckboxModule, LeaveComponent, PaginatorModule, AccordionModule, ReactiveFormsModule, ToastModule, CommonModule, CalendarModule, DialogModule, TableModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './gatepass.component.html',
  styleUrl: './gatepass.component.scss'
})
export class GatepassComponent implements OnInit {


 

  selectedGatePass: string = '';
  showStatusDialog: boolean = false;
  selectedEmpName: string = '';
  index: any;
  dtgatepass: GatePass[] = [];
  displayUpdate = false;
  gatepassform!: FormGroup;
  Leavesform: any;
  SelectRecord: any;
  checked: boolean = false;
  isupdatemode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageserveice: MessageService,
    private spinner: NgxSpinnerService,
    private servicemodule: MasterGatePass,

  ) { }

   

  


  selectedLeave = {
    EmpName: 'Ravi Kumar',
    Reason: 'Medical'
  };

showLeaveComponent = false;
handleLeaveSaved(data: any) {
  console.log('Child sent data to parent:', data);
  this.showLeaveComponent = false;
  // You can save to backend or update your table here
}
  


  ngOnInit() {
    this.formbuilder();
    console.log("child to parent",this.selectedLeave)
    //this.getpass()
  }

  formbuilder() {
    this.gatepassform = this.fb.group({
      Id: [0],
      CompId: ['', Validators.required],
      EmployeeName: ['', Validators.required],
      Reason: ['', Validators.required],
      Status: ['Pending', Validators.required],
      DateTime: ['', Validators.required],
      CreatedDate: ['', Validators.required],
      UpdatedDate: ['', Validators.required],
      ReturningOn: ['', Validators.required],
      IsPersonal: [false],
      IsReturning: [false],
      InTime: ['', Validators.required],
      OutTime: ['', Validators.required],
    })
  }

  OnTab(index: any) {
    this.index = index.any
  }

  Clear() {
    this.isupdatemode = false;
    this.gatepassform.reset();
    this.index = 1;
    this.SelectRecord.null;
  }



  OpenDailog() {
    if (this.SelectRecord?.Id) {
      this.displayUpdate = true;
    }
    else {
      this.messageserveice.add({
        key: 'account',
        summary: 'Warn',
        severity: 'warn',
        detail: 'Please select the record',
        life: 2000
      })
    }
  }

  CloseDailog() {
    this.displayUpdate = false;
  }

  onRowSelect() {
    this.isupdatemode = true;
    this.gatepassform.patchValue(this.SelectRecord)
  }

  onGlobalFilter(Table: Table, event: Event) {
    onGlobalTableFilter(Table, event);
  }

  ShowMessage() {
    if (this.isupdatemode) {
      this.messageserveice.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warn',
        detail: 'Cannot edit this field during update',
        life: 2000
      })
    }
  }

  Update() {
    this.spinner.show();
    this.servicemodule.UpdateGatepass(this.gatepassform.value).subscribe({
      next: (data) => {
        this.Clear();
        this.getpass();
        this.spinner.hide();
        this.messageserveice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Updated',
          life: 2000
        });
        this.displayUpdate = false;
      },
      error: (err) => {
        this.spinner.hide();
        this.messageserveice.add({
          key: 'account',
          severity: 'warn',
          summary: 'Warn',
          detail: err?.error?.Message || 'Something went wrong',
          life: 2000
        });
        this.spinner.hide();
      }
    })

  }

  Save() {
    if (this.gatepassform.valid) {
      this.spinner.show();
      this.gatepassform.value.Id =
        this.gatepassform.value.Id === null ? 0 :
          this.gatepassform.value.Id

      const selectedDate: Date = new Date(this.gatepassform.value.UpdatedDate);
      const selectData1: Date = new Date(this.gatepassform.value.CreatedDate);
      const selectData3: Date = new Date(this.gatepassform.value.DateTime);
      const selectData4: Date = new Date(this.gatepassform.value.OutTime);
      const payload = {
        ...this.gatepassform.value,
        UpdatedDate: formatDate(selectedDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
        CreatedDate: formatDate(selectData1, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
        DateTime: formatDate(selectData3, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
        OutTime: formatDate(selectData4, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
        //pass: this.gatepassform.value.pass
      };

      this.servicemodule.AddGatepass(payload).subscribe({
        next: (data: GatePass) => {
          this.getpass();
          this.spinner.hide();
          this.messageserveice.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Record Saved Succesfully'
          });
        },

        error: (err) => {
          this.messageserveice.add({
            key: 'account',
            severity: 'error',
            summary: 'Error',
            detail: err.error.Message || 'something went wrong'
          });
           if (err.status === 403 || err.status === 400) {
          this.messageserveice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Add.',
            life: 4000,
          });
          return;
        }
        },
      })
    }
    else {
      this.gatepassform.markAllAsTouched();
    }
  }

  getpass() {
    this.spinner.show();
    this.servicemodule.allgateall().subscribe({
      next: (data) => {
        this.dtgatepass = Array.isArray(data.Data) ? (data.Data) : [];
        this.messageserveice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully get the data',
          life: 2000
        });
        this.spinner.hide();
      },
      error: (err) =>

        this.messageserveice.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
        })
    })
  }
  validateBasicFields(): boolean {
    const companyId = this.gatepassform.get('CompId');//This returns the FormControl object itself.
    const empName = this.gatepassform.get('EmployeeName');
    //You can then check its state (valid/invalid, touched/dirty) or call methods like markAsTouched().
    //FormControl object
    companyId?.markAsTouched();
    empName?.markAsTouched();
    if (empName?.invalid || companyId?.invalid)//empty,custom validator that fails,Control is disabled,pattern validator that fails
    {
      this.messageserveice.add({
        key: 'account',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Company Id and Employee Name are required'
      });
      return false;
    }
    return true;
  }

  Details() {
    const compId = this.gatepassform.value.CompId;//gives you all the current values of the form as a plain object.
    const empName = this.gatepassform.value.EmployeeName;
    this.Status(empName, compId, 'VIEW');
  }

  StatusDetails() {
    const compId = this.gatepassform.value.CompId;//gives you all the current values of the form as a plain object.
    const empName = this.gatepassform.value.EmployeeName;
    this.Status(empName, compId, 'STATUS');
  }


  Status(EmployeeName: string, CompId: number, action: EmployeeAction) {
    if (!this.validateBasicFields())
      return
    this.spinner.show();
    this.servicemodule.StatusCheck(EmployeeName, CompId).subscribe({
      next: (Data: any) => {
        console.log("Data Approved or not", Data);
        const leaves = Data.Data
          ? (Array.isArray(Data.Data) ? Data.Data : [Data.Data])
          : [];

       if (action === 'VIEW') {
          if (Array.isArray(Data.Data)) {
            this.dtgatepass = Data.Data;
          }
          else if (Data.Data) {
            this.dtgatepass = [Data.Data];
          }
          this.messageserveice.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Successful get the record'
          });
          this.spinner.hide();
        }

        if (action === 'STATUS') {
          this.showStatusDialog = true;

          this.selectedEmpName = leaves[0].EmpName;
          this.selectedGatePass = leaves[0].Status; // e.g., 'Approved' or 'Rejected'
          this.showStatusDialog = true; // show popup
        }
        this.spinner.hide();
      },

      error: (err) => {
        this.spinner.hide();
        this.messageserveice.add({
          key: 'account',
          severity: 'warn',
          summary: 'Error',
          detail: 'GatePass cannot be retrieved',
          life: 2000
        });
            if (err.status === 403 || err.status === 400) {
          this.messageserveice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Get the Data.',
            life: 4000,
          });
          return;
        }
      }
    });
  }

}