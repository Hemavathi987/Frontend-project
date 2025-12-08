import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-gatepass',
  standalone: true,
  imports: [ToolbarModule, CheckboxModule, PaginatorModule, AccordionModule, ReactiveFormsModule, ToastModule, CommonModule, CalendarModule, DialogModule, TableModule],
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

  ngOnInit() {
    this.formbuilder();
    this.getpass()
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


 Details() {
   
     const EmpName = prompt('Enter Name');
    if (!EmpName) {
      this.messageserveice.add({ severity: 'warn', summary: 'Cancelled', detail: 'Name is required' });
      return;
    }

  const Compstr = prompt('Enter Company Id');
    if (!Compstr) {
      this.messageserveice.add({ severity: 'warn', summary: 'Cancelled', detail: 'Company is required' });
      return;
    }

    const CompId = Number(Compstr);
    if (!CompId) {
      this.messageserveice.add({ severity: 'error', summary: 'Invalid CompanyID', detail: 'CompanyID must be a number' });
      return;
    }
 
    this.Status(EmpName,CompId)
  }


  Status(EmpName: string,CompId : number) {
  this.spinner.show();
  this.servicemodule.StatusCheck(EmpName,CompId).subscribe({
    next: (Data: any) => {
      console.log("Data Approved or not", Data);
     const leaves = Data.Data 
                     ? (Array.isArray(Data.Data) ? Data.Data : [Data.Data])
                     : [];
      if (leaves.length === 0) {
        this.messageserveice.add({
          key: 'account',
          severity: 'warn',
          summary: 'No Data',
          detail: 'No GatePass records found for this employee',
          life: 2000
        });
      } else {
        // Assuming you take the first leave record for the popup
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
    }
  });
}

}