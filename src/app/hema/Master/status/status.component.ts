import {Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StatusEmployee } from '../../Model/Model';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonDirective, Button } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { MasterStatus } from '../../Service/Status';
import { EmployeeComponent } from "../employee/employee.component";


@Component({
  selector: 'app-status',
  standalone: true,
  imports: [ToastModule, TableModule, CalendarModule, FloatLabelModule, PaginatorModule, AccordionModule, CommonModule, ToolbarModule, ReactiveFormsModule, DialogModule, ButtonDirective, TooltipModule, Button, EmployeeComponent],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit,OnDestroy,AfterViewInit {
 
  emp2 = { name: 'Ravi', role: 'Developer' };

  StatusValid!: FormGroup;
  satus: StatusEmployee = {};
  dtStatus: StatusEmployee[] = [];
  isupdatemode: boolean = false;
  SelectRecord: any;
  index: any;
  displayUpdate = false;
  displaydelete = false;
@ViewChild('dt1') dtTable!: Table;


 ngOnInit(): void {
      console.log('2️⃣ ngOnInit', Date.now());
    this.formvalidation();
    this.getAdress();
  }

  constructor(
       
    private messageservice: MessageService,
    private spinner: NgxSpinnerService,
    private router: Router,
   
    private fb: FormBuilder,
    private masterservice: MasterStatus,
   
  ) {  console.log('2️⃣ Constructor', Date.now());}
  
  ngAfterViewInit(): void {
      console.log('2️⃣ ngAfterViewInit', Date.now());
     setTimeout(() => {
    console.log('⏱️ ngAfterViewInit AFTER 5 SECONDS');
  }, 5000);
  console.log('Table is ready', this.dtTable);

  // Example: You can access the table rows programmatically
  if (this.dtStatus.length > 0) {
    console.log('First row:', this.dtStatus[0]);
  }
console.log('ngAfterViewInit executed ✅');
 
}

 
  formvalidation() {
    this.StatusValid = this.fb.group(
      {
        Id: [0],
        CompanyId: ['', Validators.required],
        EmpName: ['', Validators.required],
        PhoneNumber: ['', Validators.required],
        Qualification: ['', Validators.required],
        Department: ['', Validators.required],
        DOJ: ['', Validators.required],
        Jobrole: ['', Validators.required],
        OnBoarding: ['', Validators.required]

      });
  }

 

  OnTab(num: any) {
    this.index = num.index;
  }

  Clear() {
    this.isupdatemode = false;
    this.StatusValid.reset();
    this.index = 1;
    this.SelectRecord.null;
  }

  onRowSelect() {
    this.isupdatemode = true;
    this.StatusValid.patchValue(this.SelectRecord);
  }

  showmessage() {
    if (this.isupdatemode) {
      this.messageservice.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warn',
        detail: 'Cannot edit this field during update',
        life: 2000
      });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event);
  }


  Save() {
    if (this.StatusValid.valid) {
      this.spinner.show();


      this.StatusValid.value.Id =
        this.StatusValid.value.Id === null ? 0 :
          this.StatusValid.value.Id;


      this.masterservice.postEmployeeStatus(this.StatusValid.value).subscribe({
        next: (data: StatusEmployee) => {

          this.getAdress();
          this.Clear();
          this.spinner.hide();
          this.messageservice.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Record Saved Succesfully'
          });
        },
        error: (err) => {
          this.messageservice.add({
            key: 'account',
            severity: 'error',
            summary: 'Error',
            detail: err.error.Message || 'something went wrong'
          });
        },
      });
    }
    else {
      this.StatusValid.markAllAsTouched();
    }
  }


  getAdress() {
    this.spinner.show();
    this.masterservice.GetAllStatusEmployee().subscribe({
      next: (data) => {
        console.log('Employee Details', data);
        this.dtStatus = Array.isArray(data.Data) ? data.Data : [];
        this.messageservice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successful get the record'
        });
        this.spinner.hide();
      },
      error: (err) =>
        this.messageservice.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
        })
    });
  }
  //Delete
  CloseDeleteDailog() {
    this.displaydelete = false;
  }
  OpenDeleteDailog() {
    if (this.SelectRecord?.Id) {
      this.displaydelete = true;
    }
    else {
      this.messageservice.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please Select the Record',
        life: 2000
      });
    }
  }
  Delete() {
    this.spinner.show();
    this.masterservice.deleteEmployeeStatus(this.StatusValid.value.EmpName).subscribe({
      next: (data: any) => {
        this.Clear();
        this.getAdress();
        this.spinner.hide();
        this.messageservice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Record Deleted Successfully',
          life: 3000,
        });
        this.displaydelete = false;
      },
      error: (err) => {
        this.spinner.hide();
        this.messageservice.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000,
        });
        if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Delete the Data.',
            life: 4000,
          });
          return;
        }
        this.spinner.hide();
      }

    });

  }

  // Update
  CloseDailog() {
    this.displayUpdate = false;
  }
  OpenDailog() {
    if (this.SelectRecord?.Id) {

      this.displayUpdate = true;
    }
    else {
      this.messageservice.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please Select the Record',
        life: 2000
      });
    }

  }
  Update() {
    this.spinner.show();
    this.masterservice.UpdateEmployeeStatus(this.StatusValid.value).subscribe({
      next: (data) => {
        this.Clear();
        this.getAdress();
        this.spinner.hide();
        this.messageservice.add({
          key: 'account',
          severity: 'success',
          summary: 'success',
          detail: 'Updated successfully',
          life: 3000,
        });
        this.displayUpdate = false;
      },
      error: (err) => {
        this.spinner.hide();
        this.messageservice.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000,
        });
        if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Update the Data.',
            life: 4000,
          });
          return;
        }
        this.spinner.hide();
      }
    });
  }

  jobRoles = [
    { label: 'Tester', value: 'Tester' },
    { label: 'Developer', value: 'Developer' },
    { label: 'IT Support', value: 'IT Support' },
    { label: 'HR', value: 'HR' }
  ];
  OnBoarding = [
    { label: 'OnBoard', value: 'OnBoard' },

  ];
   Department = [
    { label: 'IT', value: 'IT' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Mechanic', value: 'Mechanic' },
    

  ];

   ngOnDestroy() {
  console.log('PageA destroyed');
}

  Next() {
    this.router.navigate(['/master/employee/adress']);

  }
  Previous() {
    this.router.navigate(['/master/employee/employee']);
  }



}


// How it actually works in your component:

// Component created → constructor runs

// Inputs from parent set → ngOnChanges runs (if any)

// ngOnInit runs → your form and API code run

// HTML template renders → dropdowns, table, form appear on screen

// ngAfterViewInit runs → only if you wrote it

// Later, if you navigate away → Angular destroys the component, calls ngOnDestroy if you wrote it