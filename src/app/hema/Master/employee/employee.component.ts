import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Employee, EmployeeAdress, StatusEmployee } from '../../Model/Model';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from '../../Service/Service';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from "primeng/tooltip";
import { Router } from '@angular/router';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, ToolbarModule, FloatLabelModule, TableModule, CommonModule, AccordionModule, ButtonModule, DialogModule, PaginatorModule, ToastModule, TooltipModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  dtEmployee: Employee[] = [];
  dtadress: EmployeeAdress[] = [];
  dtStatus: StatusEmployee[] = [];
  employee: Employee = {};
  displayPopup: boolean = false;
  cols: any[] = [];
  EmployeeForm!: FormGroup;
  index = 1;
  SelectedRecord: any;
  displaydelete = false;
  displayUpdate = false;
  displayDialog = false;
  isUpdateMode: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private mastetService: MasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formvalidation();

    this.getEmployee();
  }

  formvalidation() {
    this.EmployeeForm = this.formbuilder.group({
      Id: [0],
      CompanyId: ['', Validators.required],
      Name: ['', Validators.required],
      Age: ['', Validators.required],
      Email: ['', Validators.required],

    });
  }


  clear() {
    this.isUpdateMode = false;
    this.EmployeeForm.reset();
    this.index = 1;
    this.SelectedRecord = null;
  }

  ShowMessage() {
    if (this.isUpdateMode) {
      this.messageService.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warn',
        detail: 'Cannot edit this field during update',
        life: 2000
      });
    }
  }
  OnTab(num: any) {
    this.index = num.index;
  }

  delete() {
    this.spinner.show();
    this.mastetService.Employeeiddeleteemployee(this.EmployeeForm.value.Id).subscribe({
      next: (Data) => {
        this.clear();
        this.getEmployee();
        this.spinner.hide();
        this.messageService.add({
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
        this.messageService.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000,
        });
        this.spinner.hide()
      }
    })
  }

  Save() {
    if (this.EmployeeForm.valid) {
      this.spinner.show();
      this.EmployeeForm.value.Id =
        this.EmployeeForm.value.Id === null ? 0 :
          this.EmployeeForm.value.Id;
      this.mastetService.Employeeidpostemployee(this.EmployeeForm.value).subscribe({
        next: (data: Employee) => {
          this.clear();
          this.getEmployee();
          this.spinner.hide();
          this.messageService.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Record Saved Successfully',
            life: 3000,
          });
        },
        error: (err) => {
          this.spinner.hide();
          this.messageService.add({
            key: 'account',
            severity: 'error',
            summary: 'Error',
            detail: err.error.Message,
            life: 3000,
          });
        },
      });

    } else {
      this.EmployeeForm.markAllAsTouched();
    }
  }


  openDialog() {
    if (this.SelectedRecord?.Id) {
      this.displaydelete = true;
    } else {
      this.messageService.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a record to delete',
        life: 3000,
      });
    }
  }


  Next() {
    this.router.navigate(['/master/status']);
  }



  onRowSelect(event: any) {
    this.isUpdateMode = true;
    const row: Employee = event.data; // <- get the row from event.data

    if (row) {
      this.EmployeeForm.patchValue({
        Id: row.Id ?? null,
        CompanyId: row.CompanyId ?? null,
        Name: row.Name ?? '',
        Age: row.Age ?? null,
        Email: row.Email ?? ''
      });
      this.SelectedRecord = row; // store selected row
      this.index = 1;
      console.log('Form after patch:', this.EmployeeForm.value);
    }
  }


  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event);
  }

  closeDialog() {
    this.displaydelete = false;
  }

  OpenDilag() {
    if (this.SelectedRecord?.Id) // Check
    {
      this.displayUpdate = true;
    }
    else {
      this.messageService.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please Select Record for Update',
        life: 3000,
      });
    }
  }

  CloseDialag() {
    this.displayUpdate = false;
  }


  getEmployee() {
    this.spinner.show();
    this.mastetService.Employeegetemployee().subscribe({
      next: (data: any) => {
        console.log('Employee API response:', data);
        // this.dtEmployee = Array.isArray(data) && data.length ? data : [{ Id: 0 }];
        this.dtEmployee = Array.isArray(data.Data) ? data.Data : [];
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successful get the record'
        });
        //   this.dtEmployee = data;
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.messageService.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000,
        });
      }
    });
  }

  DetailsAllInfo() {
    const Compstr = prompt('Enter Company Id');
    if (!Compstr) {
      this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'Company is required' });
      return;
    }

    const CompId = Number(Compstr);
    if (!CompId) {
      this.messageService.add({ severity: 'error', summary: 'Invalid CompanyID', detail: 'CompanyID must be a number' });
      return;
    }
    const EmpName = prompt('Enter Name');
    if (!EmpName) {
      this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'Name is required' });
      return;
    }
    this.getEmployee2(CompId, EmpName)
  }

  Details() {
    const compIdStr = prompt('Enter ID:');
    if (!compIdStr) {
      this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'ID is required' });
      return;
    }

    const Id = Number(compIdStr); // convert string to number
    if (isNaN(Id)) {
      this.messageService.add({ severity: 'error', summary: 'Invalid ID', detail: 'ID must be a number' });
      return;
    }

    this.getEmployee1(Id);
  }


  getEmployee1(Id: number) {
    this.mastetService.Employeeidgetemployee(Id).subscribe({
      next: (data: any) => {
        console.log('Employee API response:', data);
        // this.dtEmployee = Array.isArray(data) && data.length ? data : [{ Id: 0 }];
        this.dtEmployee = Array.isArray(data.Data) ? data.Data : [];
        if (Array.isArray(data.Data)) {
          this.dtEmployee = data.Data;
        }
        else if (data.Data) {
          this.dtEmployee = [data.Data];//// Data {Id: 3, CompanyId: 34678, Name: 'ChanduGowda TYYY', Age: 24, Email: 'Chandu@123'}
        }
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successful get the record'
        });
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.messageService.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000,
        });
      }
    });
  }


  Update() {
    console.log('Updating employee:', this.EmployeeForm.value);
    this.spinner.show();
    this.mastetService.Employeeidputemployee(this.EmployeeForm.value).subscribe({
      next: (data) => {
        this.clear();
        this.getEmployee();
        this.spinner.hide();
        this.messageService.add({
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
        this.messageService.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000,
        });
        this.spinner.hide();
      }

    })
  }

  getEmployee2(CompId: number, EmpName: string) {
    this.spinner.show();

    this.mastetService.AlredycreatedfullemployeeInformation(CompId, EmpName).subscribe({
      next: (data: any) => {
        console.log('🟢 Full API raw response:', data);
        const res = data?.body ? data.body : data;

        if (res?.Status?.toLowerCase?.() === 'success' && res?.Data) {
          const empData = res.Data;

          this.dtEmployee = [{
            CompanyId: empData.CompanyId,
            Name: empData.Name,
            Age: empData.Age,
            Email: empData.Email
          }];

          this.dtStatus = [{
            CompanyId: empData.CompanyId,
            EmpName: empData.Name,
            PhoneNumber: empData.PhoneNumber,
            Qualification: empData.Qualification,
            Department: empData.Department
          }];

          this.dtadress = [{
            CompanyId: empData.CompanyId,
            EmpName: empData.Name,
            Label: empData.Label,
            Address1: empData.Address1,
            Address2: empData.Address2,
            Address3: empData.Address3,
            Address4: empData.Address4,
            City: empData.City,
            State: empData.State,
            Pincode: empData.Pincode,
            Country: empData.Country,
            UpdatedDate: empData.UpdatedDate
          }];

          this.messageService.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Employee contain all the information',
            life: 3000
          });
          this.displayPopup = true;
        } else {
          console.warn('⚠️ Unexpected response format:', res);
          this.messageService.add({
            key: 'account',
            severity: 'warn',
            summary: 'Not Found',
            detail: 'Employee does not contain all the information or invalid response',
            life: 3000,
          });
        }
        //973152(Keeru) \\  997257(Jain)
        this.spinner.hide();
      },

      error: (err) => {
        this.spinner.hide();
        this.messageService.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Employee does not contain all the information',
          life: 3000,
        });
      },
    });
  }



}




