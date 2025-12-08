import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { MasterService } from '../../Service/Service';
import { FileSaverService } from 'ngx-filesaver';
import { Employee } from '../../Model/Model';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { ToolbarModule } from 'primeng/toolbar';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-report-employee',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    AccordionModule,
    ButtonModule,
    
    PdfJsViewerModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    ToolbarModule
  ],
  providers: [NgxSpinnerService, MessageService],
  templateUrl: './report-employee.component.html',
  styleUrls: ['./report-employee.component.scss']
})
export class ReportEmployeeComponent implements OnInit {
  scrollcol: any[] = [];
  footerCols: any[] = [];
  dtEmployee: Employee[] = [];
  selectEmployee: Employee = {};
  index: any;
  reportData!: any[];
  accordionTab = false;
  showDownload = false;
  isLoading = false;
  reportform!: FormGroup;
  footerData!: any[];
  pdfSrc: string | undefined;

  @ViewChild('pdfViewer', { static: false }) pdfViewer: any;

  constructor(
    private spinner: NgxSpinnerService,
    private message: MessageService,
    private employeeservice: MasterService,
    private saver: FileSaverService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getemployee();
    this.formvalidation();
  }

  formvalidation() {
    this.reportform = this.fb.group({
      Id: [0],
      CompanyId: ['', Validators.required],
      Name: ['', Validators.required]
    });
  }

  scrollcols() {
    this.scrollcol = [
      { field: 'Name', header: 'Name', width: '350px', align: 'left' },
      { field: 'Email', header: 'Email', width: '350px', align: 'left' }
    ];
  }

  FooterCols() {
    this.footerCols = [
      { field: 'Name', header: 'Name', width: '100px', align: 'right' },
      { field: 'Email', header: 'Email', width: '100px', align: 'right' }
    ];
  }

  getemployee() {
    this.spinner.show();
    this.employeeservice.Employeegetemployee().subscribe({
      next: (Data: any) => {
        this.spinner.hide();
        this.dtEmployee = Array.isArray(Data.Data) ? Data.Data : [];
        this.message.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully fetched employee records'
        });
      },
      error: (err) => {
        this.spinner.hide();
        this.message.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000
        });
      }
    });
  }

  onTab(event: any) {
    this.index = event.index;
  }

  print(type: string) {
    const selectedName = this.reportform.value.Name;

    if (!selectedName) {
      this.message.add({
        key: 'account',
        severity: 'error',
        summary: 'Error',
        detail: 'Please select an employee.',
        life: 3000
      });
      return;
    }

    this.spinner.show();
    this.isLoading = true;

    this.employeeservice.Employeegetemployee().subscribe({
      next: (data: any[]) => {
        this.spinner.hide();
        this.isLoading = false;

        const filteredData = data.filter(emp => emp.Name === selectedName);

        if (!filteredData || filteredData.length === 0) {
          this.accordionTab = false;
          this.message.add({
            key: 'account',
            severity: 'error',
            summary: 'Error',
            detail: 'No record found for selected employee.',
            life: 3000
          });
          return;
        }

        if (type === 'Data') {
          this.reportData = filteredData;
          this.footerData = [filteredData[filteredData.length - 1]];
          this.accordionTab = true;
          this.showDownload = false;
          this.scrollcols();
          this.FooterCols();
        } else if (type === 'PDF') {
          this.showDownload = true;
          this.showPDFFile(filteredData);
        } else if (type === 'EXCEL') {
          const jsonData = JSON.stringify(filteredData, null, 2);
          const blob = new Blob([jsonData], { type: 'application/json' });
          this.saver.save(blob, 'EmployeeReport.json');
          this.message.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Report saved to Downloads folder.',
            life: 3000
          });
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.isLoading = false;
        this.message.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Something went wrong',
          life: 3000
        });
      }
    });
  }

  showPDFFile(data: any) {
    // Convert JSON to PDF Blob (for simplicity using plain text PDF)
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/pdf' });
    this.pdfSrc = URL.createObjectURL(blob);

    setTimeout(() => {
      if (this.pdfViewer) this.pdfViewer.refresh();
    }, 500);
  }

  downloadPDF() {
    if (!this.pdfSrc) return;
    fetch(this.pdfSrc)
      .then(res => res.blob())
      .then(blob => {
        this.saver.save(blob, 'Hema.pdf'); // Custom download filename
      });
  }
}
