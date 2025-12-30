import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonDirective } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MasterStatus } from '../../Service/Status';
import { MasterService } from '../../Service/Service';
import { Employee, EmployeeAdress, Photo, StatusEmployee } from '../../Model/Model';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [ToastModule, TableModule, CalendarModule, FloatLabelModule, PaginatorModule, AccordionModule, CommonModule, ToolbarModule, ReactiveFormsModule, DialogModule, ButtonDirective, TooltipModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.scss'
})
export class PDFComponent implements OnInit {

  dtAdress: EmployeeAdress[] = [];
  dtEmployee: Employee[] = [];
  dtPhoto: Photo[] = [];
  dtStatus: StatusEmployee[] = [];
  index: any;
  PdfValid!: FormGroup

  ngOnInit(): void {
    this.formvalidation();
    
  }

  constructor(
    private fb: FormBuilder,
    private messageservice: MessageService,
    private spinner: NgxSpinnerService,
    private mastetService: MasterService
  ) { }

  formvalidation() {
    this.PdfValid = this.fb.group(
      {
        Id: [0],
        CompanyId: ['', Validators.required],
        Name: ['', Validators.required],
      });
  }

  OnTab(num: any) {
    this.index = num.index;
  }

generatePDF() {
  const element = document.getElementById('pdfContent');

  if (!element) return;

  html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: 'Employee_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .save();
}



  PDF() {
    const { CompanyId, Name } = this.PdfValid.value
    this.spinner.show();
    this.mastetService.AlredycreatedfullemployeeInformation(CompanyId, Name).subscribe({
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
          this.dtPhoto = [{
            CompanyId: empData.CompanyId,
            Name: empData.Name,
            PhotoBase: empData.PhotoBase
          }]

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
                setTimeout(() => {
            this.generatePDF();
            this.spinner.hide();
          }, 300);

          this.messageservice.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Employee contain all the information',
            life: 3000
          });
          //this.displayPopup = true;
        } else {
          console.warn('⚠️ Unexpected response format:', res);
          this.messageservice.add({
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
