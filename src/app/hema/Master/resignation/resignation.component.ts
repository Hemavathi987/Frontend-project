
import { Component, OnInit } from '@angular/core';
import { Leave, Resignation } from '../../Model/Model';
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
import { MasterResignation } from '../../Service/Resignation.service';
type EmployeeAction = 'VIEW' | 'STATUS';

@Component({
  selector: 'app-resignation',
  standalone: true,
  imports: [ToastModule, ToolbarModule, CalendarModule, ButtonModule, AccordionModule, CommonModule, ReactiveFormsModule, TableModule, DialogModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss'
})
export class ResignationComponent implements OnInit {
  index: any;
  Resignform!: FormGroup;
  dtResign: Resignation[] = [];
  SelectRecord: any;

  selectedResignStatus: string = '';
  showStatusDialog: boolean = false;
  selectedEmpName: string = '';

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageservice: MessageService,
    private resignservice: MasterResignation) { }

  ngOnInit(): void {
    this.formValidation();
  //  this.getResign();
  }

  formValidation() {
    this.Resignform = this.fb.group({
      Id: [0],
      EmpName: ['', Validators.required],
      CompId: ['', Validators.required],
      ResignStatus: ['Pending', Validators.required],
      ResignApplyDate: ['', Validators.required],
      ResignApproveDate: [null],
      ResignReason: ['', Validators.required],
    })
  }

  validateBasicFields(): boolean {
    const companyId = this.Resignform.get('CompId');//This returns the FormControl object itself.
    const empName = this.Resignform.get('EmpName');
    //You can then check its state (valid/invalid, touched/dirty) or call methods like markAsTouched().
    //FormControl object
    companyId?.markAsTouched();
    empName?.markAsTouched();
    if (empName?.invalid || companyId?.invalid)//empty,custom validator that fails,Control is disabled,pattern validator that fails
    {
      this.messageservice.add({
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
    const compId = this.Resignform.value.CompId;
    const empName = this.Resignform.value.EmpName;
    this.Status(empName, compId, 'VIEW');
  }


  ResignDetails() {
  const compId = this.Resignform.value.CompId;
    const empName = this.Resignform.value.EmpName;
    this.Status(empName, compId, 'STATUS');
  }

Status(EmpName: string, CompId: number, action: EmployeeAction) {
    if (!this.validateBasicFields()) { return }
    this.spinner.show();
    this.resignservice.ResignationGetNameResign(EmpName, CompId).subscribe({
      next: (Data: any) => {
        console.log("Data Approved or not", Data);
        const leaves = Data.Data
          ? (Array.isArray(Data.Data) ? Data.Data : [Data.Data])
          : [];
        if (action === 'VIEW') {
          if (Array.isArray(Data.Data)) {
            this.dtResign = Data.Data;
          }
          else if (Data.Data) {
            this.dtResign = [Data.Data];
          }
          this.messageservice.add({
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
          this.selectedResignStatus = leaves[0].ResignStatus; // e.g., 'Approved' or 'Rejected'
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


  Save() {
    if (this.Resignform.valid) {
      this.spinner.show();
      this.Resignform.value.Id =                 //'HH:mm:ss' → time only
        this.Resignform.value.Id === null ? 0 :   // 'yyyy-MM-dd' → date only
          this.Resignform.value.Id;                // 'yyyy-MM-dd HH:mm:ss' → date + time

   
      const toDate: Date = this.Resignform.value.ResignApplyDate;

      const payload = {
        ...this.Resignform.value,
      
        ToDate: formatDate(toDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US')
      };
      this.resignservice.ResignationApplyResign(payload).subscribe({
        next: (Data: any) => {
          this.Clear();
          this.getResign();
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
      this.Resignform.markAllAsTouched();
    }
  }



 getResign() {
    this.spinner.show();
    this.resignservice.ResignationGetResign().subscribe({
      next: (Data: any) => {
        console.log("get data", Data);
        this.dtResign = Array.isArray(Data.Data.Value) ? Data.Data.Value : [];
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


  Clear() {
    this.Resignform.reset();
    this.index = 1;

  }

  OnTab(num: any) {
    this.index = num.index;
  }

  onRowSelect() {
    this.Resignform.patchValue(this.SelectRecord);
  }

  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event)
  }

}
