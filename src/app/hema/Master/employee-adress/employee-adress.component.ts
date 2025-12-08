import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { MasterEmployyAdressService } from '../../Service/employee.adress.service';
import { ToastModule } from 'primeng/toast';
import { Employee, EmployeeAdress, StatusEmployee } from '../../Model/Model';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonDirective, Button } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { CommonModule, formatDate } from '@angular/common';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { MasterService } from '../../Service/Service';





@Component({
  selector: 'app-employee-adress',
  standalone: true,
  imports: [ToastModule, TableModule, CalendarModule, PaginatorModule, AccordionModule, CommonModule, ToolbarModule, ReactiveFormsModule, DialogModule, ButtonDirective, TooltipModule, Button],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './employee-adress.component.html',
  styleUrl: './employee-adress.component.scss'
})
export class EmployeeAdressComponent implements OnInit {

  Adress: EmployeeAdress = {};
displayPopup : boolean = false;
  dtAdress: EmployeeAdress[] = [];
  dtEmployee : Employee[] = [];
  dtStatus : StatusEmployee[] = [];
  AdressForm!: FormGroup;
  index: any;
  SelectRecord: any;
  cols: any[] = [];
  displayUpdate = false;
  displaydelete = false;
  isupdatemode : boolean = false;

  ngOnInit(): void {
    this.ValidationForm();

    this.getAdress();
  }

  constructor(
    private fb: FormBuilder,
    private masterservice: MasterEmployyAdressService,
    private spinner: NgxSpinnerService,
    private messageservice: MessageService,
    private router:Router,
    private mastetService : MasterService
  ) { }


  ValidationForm() {
    this.AdressForm = this.fb.group({
      Id: [0],
      CompanyId: ['', Validators.required],
      EmpName: ['', Validators.required],
      Label: ['', Validators.required],
      Address1: ['', Validators.required],
      Address2: [''],
      Address3: [''],
      Address4: [''],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Pincode: ['', Validators.required],
      Country: ['', Validators.required],
      UpdatedDate: ['', Validators.required]

    });
  }

  OnTab(num: any) {
    this.index = num.index;
  }

  Clear() {
    this.isupdatemode=false;
    this.AdressForm.reset();
    this.index = 1;
    this.SelectRecord.null;
  }

  onRowSelect() {
    this.isupdatemode=true;
    this.AdressForm.patchValue(this.SelectRecord);
     
  }

showmessage()
{
  if(this.isupdatemode)
  {
    this.messageservice.add({
      key:'account',
      severity:'warn',
      summary:'Warn',
      detail:'Cannot edit this field during update',
      life:2000
    });
  }
}
  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event);
  }

 
  Save() {
    if (this.AdressForm.valid) {
      this.spinner.show();
     
     
      this.AdressForm.value.Id =
        this.AdressForm.value.Id === null ? 0 :
          this.AdressForm.value.Id;

           const SetTime : Date = new Date(this.AdressForm.value.UpdatedDate);

     const Payload ={
     ...this.AdressForm.value,
     UpdatedDate : formatDate(SetTime,'yyyy-MM-ddTHH:mm:ss','en-Us')
     };

      this.masterservice.AddEmployeeAdress(Payload).subscribe({
        next: (data: EmployeeAdress) => {
        
          this.getAdress();
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
      this.AdressForm.markAllAsTouched();
    }
  }


  getAdress() {
    this.spinner.show();
    this.masterservice.GetAllEmployeeAdress().subscribe({
      next: (data) => {
        console.log('Employee Details', data);
        this.dtAdress = Array.isArray(data.Data) ? data.Data : [];
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
    this.masterservice.iddeletemployeeadress(this.AdressForm.value.EmpName).subscribe({
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
    this.masterservice.UpdateEmployeeAdress(this.AdressForm.value).subscribe({
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
        this.spinner.hide();
      }
    });
  }

  
  Previous()
  {
    this.router.navigate(['/master/status']);
  }

  Next() {
  const compId = this.AdressForm.value.CompanyId;     // whatever you use
  const empName = this.AdressForm.value.EmpName;  // or from form/control  
  this.getEmployee2(compId, empName);
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

        this.dtAdress = [{
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

        this.messageservice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Employee contain all the information',
          life:3000
        });
          this.displayPopup = true;
      } else {
        console.warn('⚠️ Unexpected response format:', res);
        this.messageservice.add({
          key: 'account',
          severity: 'warn',
          summary: 'Not Found',
          detail: 'Employee does not contain all the information or invalid response',
          life:3000,
        });
      }
    //973152(Keeru) \\  997257(Jain)
      this.spinner.hide();
    },

    error: (err) => {
      this.spinner.hide();
      this.messageservice.add({
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
