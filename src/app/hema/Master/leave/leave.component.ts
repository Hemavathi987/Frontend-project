import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { LeaveApproveComponent } from "../leave-approve/leave-approve.component";
type EmployeeAction = 'VIEW' | 'STATUS';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [ToastModule, ToolbarModule, CalendarModule, ButtonModule, AccordionModule, CommonModule, ReactiveFormsModule, TableModule, DialogModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})

export class LeaveComponent implements OnInit {

  @Input() selectedLeave: any; // <-- Parent can now pass data
  @Input() show: boolean = false; // optional visibility control

  @Output() leaveSaved: EventEmitter<any> = new EventEmitter(); // emit data to parent
  @Output() closed: EventEmitter<void> = new EventEmitter(); // close event

   
 


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
   // console.log('leave',this.leave)
     console.log("child to in leave that is parent",this.selectedLeave)
    // this.getLeaves();
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


  validateBasicFields(): boolean {
    const companyId = this.Leavesform.get('CompanyId');//This returns the FormControl object itself.
    const empName = this.Leavesform.get('EmpName');
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
    const compId = this.Leavesform.value.CompanyId;//gives you all the current values of the form as a plain object.
    const empName = this.Leavesform.value.EmpName;  // or from form/control  
    this.Status(empName, compId, 'VIEW');
  }
   StatusDetails() {
    const compId = this.Leavesform.value.CompanyId;//gives you all the current values of the form as a plain object.
    const empName = this.Leavesform.value.EmpName;  // or from form/control  
    this.Status(empName, compId, 'STATUS');
  }

  Status(EmpName: string, CompanyId: number, action: EmployeeAction) {
    if (!this.validateBasicFields()) { return }
    this.spinner.show();
    this.leaveservice.getidLeave(EmpName, CompanyId).subscribe({
      next: (Data: any) => {
        console.log("Data Approved or not", Data);
        const leaves = Data.Data
          ? (Array.isArray(Data.Data) ? Data.Data : [Data.Data])
          : [];
        if (action === 'VIEW') {
          if (Array.isArray(Data.Data)) {
            this.dtleaves = Data.Data;
          }
          else if (Data.Data) {
            this.dtleaves = [Data.Data];
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
            if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
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
      error: (err) =>{
        this.messageservice.add({
          key: 'account',
          severity: 'warn',
          summary: 'Error',
          detail: 'Data cannot get',
          life: 2000
        })
      
      }
        
    })
  }

  

  Save() {
    if (this.Leavesform.valid) {
        this.leaveSaved.emit(this.Leavesform.value); 
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
            if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
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
      this.Leavesform.markAllAsTouched();
    }
  }

  Clear() {
     this.closed.emit(); // notify parent
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

