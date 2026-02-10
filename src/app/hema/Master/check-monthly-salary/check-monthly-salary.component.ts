import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MonthlySalary } from '../../Model/Model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MasterSalary } from '../../Service/salary';
import { ButtonDirective } from 'primeng/button';
import html2pdf from 'html2pdf.js';
type EmployeeAction = 'VIEW' | 'PDF';

@Component({
  selector: 'app-check-monthly-salary',
  standalone: true,
  imports: [ToastModule, TableModule, ButtonDirective, FloatLabelModule, PaginatorModule, AccordionModule, CommonModule, ToolbarModule, ReactiveFormsModule, DialogModule, TooltipModule],
  providers: [NgxSpinnerService, MessageService],
  templateUrl: './check-monthly-salary.component.html',
  styleUrl: './check-monthly-salary.component.scss'
})
export class CheckMonthlySalaryComponent implements OnInit {
  dtSalary: MonthlySalary[] = [];
  SelectRecord: any;
  displayViewPopup : boolean = false;
  SalaryValid : any;
  activeIndex: number | null = null;

  ngOnInit(): void {
    //this.getSalary();
    this.formvalidation();
  }

   formvalidation() {
      this.SalaryValid = this.fb.group(
        {
          Id: [0],
          CompanyId: ['', Validators.required],
          Name: ['', Validators.required]
        }
      )}

  constructor(
    private spinner: NgxSpinnerService,
    private messageservice: MessageService,
    private mastersalary: MasterSalary,
    private fb : FormBuilder
  ) { }

  onRowSelect(event: any) {
    this.SelectRecord = event.data;
  }

  openAcknowledgement() {
  if (!this.SelectRecord) {
    this.messageservice.add({
      severity: 'warn',
      summary: 'No Selection',
      detail: 'Please select a row first'
    });
    return;
  }
  // Use selected row data for PDF
  this.dtSalary = [this.SelectRecord];
  // Open dialog
  this.displayViewPopup = true;
}


  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event);
  }

  getSalary() {
    this.spinner.show();
    this.mastersalary.CheckMonthlySalryAllemployee().subscribe({
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
 Next() {
   
    const compId = this.SalaryValid.value.CompanyId;//gives you all the current values of the form as a plain object.
    const empName = this.SalaryValid.value.Name;  // or from form/control  
    this.getSalaryName(compId, empName);
    
  }

  getSalaryName(CompId: number, Name: string) {
     if (!this.validateBasicFields())
      return;
    this.spinner.show();
    this.mastersalary.CheckMonthlySalrySalaryName(CompId, Name).subscribe({
      next: (data) => {
        console.log('SALARY Details', data);
        if (Array.isArray(data.Data)) {
          this.dtSalary = data.Data;
        }
        else if (data.Data) {
          this.dtSalary = [data.Data];
        } 
        this.messageservice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successful get the record'
        });
        this.spinner.hide();

        this.activeIndex = 0;
      },
      error: (err) =>{
        this.messageservice.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
        })
           if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Edit the Data.',
            life: 4000,
          });
          return;
        }
      }
    });
  }


generatePDF()
{
 const element = document.getElementById('pdfContent');
  if (!element) return;

  const options: any = {
    margin: 10,
    filename: 'Employee_Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] } // ✅ works
  };
  html2pdf().from(element).set(options).save();
  }
 
   

}
