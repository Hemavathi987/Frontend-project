import { Component, OnInit } from '@angular/core';
import { Leave } from '../../Model/Model';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { MasterLeave } from '../../Service/leave';
import { ToastModule } from "primeng/toast";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolbarModule } from "primeng/toolbar";
import { AccordionModule } from "primeng/accordion";
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from "primeng/dialog";

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [ToastModule, ToolbarModule, CalendarModule, ButtonModule, AccordionModule, CommonModule, ReactiveFormsModule, TableModule, DialogModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})

export class LeaveComponent implements OnInit {
  dtleaves: Leave[] = [];
  Leavesform!: FormGroup;
  index: any;
  SelectRecord: any;
// Add these properties
selectedLeaveStatus: string = '';
showStatusDialog: boolean = false;
selectedEmpName: string = '';

  ngOnInit(): void {
    this.formValidation();
    this.getLeaves();
  }


  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageservice: MessageService,
    private leaveservice: MasterLeave

  ) { }


  formValidation() {
    this.Leavesform = this.fb.group({
      Id: [0],
      CompanyId: ['', Validators.required],
      EmpName: ['', Validators.required],
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      Reason: ['', Validators.required],
      Status: ['Pending', Validators.required],
      EmpCode: ['', Validators.required],
      NoOfDays: ['0', Validators.required],
    })
  }

 Details() {
   
  const EmpName = prompt('Enter Name');
    if (!EmpName) {
      this.messageservice.add({ severity: 'warn', summary: 'Cancelled', detail: 'Name is required' });
      return;
    }
    this.Status(EmpName);
  }


  Status(EmpName: string) {
  this.spinner.show();
  this.leaveservice.getidLeave(EmpName).subscribe({
    next: (Data: any) => {
      console.log("Data Approved or not", Data);
     const leaves = Data.Data 
                     ? (Array.isArray(Data.Data) ? Data.Data : [Data.Data])
                     : [];
      if (leaves.length === 0) {
        this.messageservice.add({
          key: 'account',
          severity: 'warn',
          summary: 'No Data',
          detail: 'No leave records found for this employee',
          life: 2000
        });
      } else {
        // Assuming you take the first leave record for the popup
        this.selectedEmpName = leaves[0].EmpName;
        this.selectedLeaveStatus = leaves[0].Status; // e.g., 'Approved' or 'Rejected'
        this.showStatusDialog = true; // show popup
      }

      this.spinner.hide();
    },
    error: (err) => {
      this.spinner.hide();
      this.messageservice.add({
        key: 'account',
        severity: 'warn',
        summary: 'Error',
        detail: 'Data cannot be retrieved',
        life: 2000
      });
    }
  });
}


  getLeaves() {
    this.spinner.show();
    this.leaveservice.getallleave().subscribe({
      next: (Data: any) => {
        console.log("get data", Data);
        this.dtleaves = Array.isArray(Data.Data) ? Data.Data : [];
        this.messageservice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Get Data Succesfully',
          life: 2000
        });
        this.spinner.hide();
      },
      error: (err) =>
        this.messageservice.add({
          key: 'account',
          severity: 'warn',
          summary: 'Error',
          detail: 'Data cannot get',
          life: 2000
        })
    })
  }


  Save() {
    if (this.Leavesform.valid) {
      this.spinner.show();
      this.Leavesform.value.Id =                 //'HH:mm:ss' → time only
        this.Leavesform.value.Id === null ? 0 :   // 'yyyy-MM-dd' → date only
          this.Leavesform.value.Id;                // 'yyyy-MM-dd HH:mm:ss' → date + time

      const fromDate: Date = new Date(this.Leavesform.value.FromDate);
      const toDate: Date = this.Leavesform.value.ToDate;

      const payload = {
        ...this.Leavesform.value,
        FromDate: formatDate(fromDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
        ToDate: formatDate(toDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US')
      };                                                  
      this.leaveservice.addLeave(payload).subscribe({
        next: (Data: any) => {
          this.Clear();
          this.getLeaves();
          this.spinner.hide();
          this.messageservice.add({
            key: 'account',
            severity: 'Success',
            summary: 'Success',
            detail: 'Leaves Added Successfyully',
            life: 3000,
          });
        },
        error: (err) => {
          this.messageservice.add({
            key: 'account',
            severity: 'error',
            summary: 'Error',
            detail: err.error.Message || 'Something went wrong',
            life: 3000,
          });
        },
      })
    }
    else {
      this.Leavesform.markAllAsTouched();
    }
  }

  Clear() {
    this.Leavesform.reset();
    this.index = 1;

  }

  OnTab(num: any) {
    this.index = num.index;
  }

  onRowSelect() {
    this.Leavesform.patchValue(this.SelectRecord);
  }

  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event)
  }

}

