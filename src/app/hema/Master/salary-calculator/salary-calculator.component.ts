import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MonthlySalary, StatusEmployee } from '../../Model/Model';
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
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MasterSalary } from '../../Service/salary';

@Component({
  selector: 'app-salary-calculator',
  standalone: true,
  imports: [ToastModule, TableModule, DropdownModule, CalendarModule, FloatLabelModule, PaginatorModule, AccordionModule, CommonModule, ToolbarModule, ReactiveFormsModule, DialogModule, ButtonDirective, TooltipModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './salary-calculator.component.html',
  styleUrl: './salary-calculator.component.scss'
})
export class SalaryCalculatorComponent implements OnInit {
  index: any;
  SalaryValid!: FormGroup;
  dtSalary: MonthlySalary[] = [];
  isupdatemode: boolean = false;
  displaydelete: boolean = false;
  SelectRecord: any;
  displayUpdate: boolean = false;
  cities: any;
  year: any;

  ngOnInit(): void {
    this.getSalary();
    this.formvalidation();
    this.label();
    this.Year();
    this.Clear();
  }

  constructor(private messageservice: MessageService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private mastersalary: MasterSalary) { }

  formvalidation() {
    this.SalaryValid = this.fb.group(
      {
        Id: [0],
        CompanyId: ['', Validators.required],
        Name: ['', Validators.required],
        Days: ['', Validators.required],
        DailyWages: [0],
        Salary: [0],
        LPA: ['', Validators.required],
        Tax: [0],
        PF: [0],
        HealthInsurance: [0],
        TotalSalaryPerYear: [0],
        MonthlySalaryEmployee: [0],
        Monthly: ['', Validators.required],
        Year: ['', Validators.required]
      });

  }


  Clear() {
    this.isupdatemode = false;
    this.index = 1;
    this.SalaryValid.reset();
    this.SelectRecord = null;
  }

  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event);
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

  onRowSelect() {
    this.isupdatemode = true;
    this.SalaryValid.patchValue(this.SelectRecord);
  }


  Save() {
    if (this.SalaryValid.valid) {
      this.spinner.show();
      this.SalaryValid.value.Id =
        this.SalaryValid.value.Id === null ? 0 :
          this.SalaryValid.value.Id;
      this.mastersalary.MonthlySalrypostemployee(this.SalaryValid.value).subscribe({
        next: (data: MonthlySalary) => {
          this.getSalary();
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
      this.SalaryValid.markAllAsTouched();
    }
  }

  validateBasicFields(): boolean {
    const companyId = this.SalaryValid.get('CompanyId');//This returns the FormControl object itself.
    const empName = this.SalaryValid.get('Name');
    //You can then check its state (valid/invalid, touched/dirty) or call methods like markAsTouched().
    //FormControl object
    companyId?.markAsTouched();
    empName?.markAsTouched();


    if (companyId?.invalid || empName?.invalid)//empty,custom validator that fails,Control is disabled,pattern validator that fails
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

  SendEmail() {
    //this.displayEditPopup = false;
    const compId = this.SalaryValid.value.CompanyId;//gives you all the current values of the form as a plain object.
    const empName = this.SalaryValid.value.Name;  // or from form/control  
    this.SendEmailgetEmployee2(compId, empName);
  }
  SendEmailgetEmployee2(CompId: number, Name: string) {
    if (!this.validateBasicFields())
      return;
    this.spinner.show();

    this.mastersalary.MonthlySalrySalaryName(CompId, Name).subscribe({
      next: (data: any) => {
        console.log('🟢 Full API raw response:', data);
        const res = data?.body ? data.body : data;

        if (res?.Status?.toLowerCase?.() === 'success' && res?.Data) {
          const empData = res.Data;

          this.dtSalary = [{
            CompanyId: empData.CompanyId,
            Name: empData.Name,
            Days: empData.Days,
            DailyWages: empData.DailyWages,
            PF: empData.PF,
            Tax: empData.Tax,
            Salary: empData.Salary,
          }];

          this.messageservice.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Email Sent Successfully',
            life: 3000
          });

        } else {
          console.warn('⚠️ Unexpected response format:', res);
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Not Found',
            detail: 'Cannot Send Email',
            life: 3000,
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
          detail: err?.error?.Message || 'Cannot Send Email',
          life: 3000,
        });
      },
    });
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
    this.mastersalary.MonthlySalryputSalary(this.SalaryValid.value).subscribe({
      next: (data) => {
        this.Clear();
        this.getSalary();
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

  CloseDailog() {
    this.displayUpdate = false;
  }

  Delete() {
    this.spinner.show();
    this.mastersalary.MonthlySalrydeleteemployee(this.SalaryValid.value.Name).subscribe({
      next: (data: any) => {
        this.Clear();
        this.getSalary();
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


  OnTab(num: any) {
    this.index = num.index;
  }


  getSalary() {
    this.spinner.show();
    this.mastersalary.MonthlySalryAllemployee().subscribe({
      next: (data) => {
        console.log('SALARY Details', data);
        this.dtSalary = Array.isArray(data.Data) ? data.Data : [];

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

  label() {
    this.cities = [
      { name: 'January', code: 'Jan' },
      { name: 'February', code: 'Feb' },
      { name: 'March', code: 'Mar' },
      { name: 'April', code: 'Apr' },
      { name: 'May', code: 'May' },
      { name: 'June', code: 'Jun' },
      { name: 'July', code: 'Jul' },
      { name: 'August', code: 'Aug' },
      { name: 'September', code: 'Sep' },
      { name: 'October', code: 'Oct' },
      { name: 'November', code: 'Nov' },
      { name: 'December', code: 'Dec' }
    ];
  }

  Year() {
    this.year = [
      { name: '2024', code: '24' },
      { name: '2025', code: '25' },
      { name: '2026', code: '26' },
    ];

  }
}
