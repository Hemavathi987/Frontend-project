import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Employee, Leave, Resignation, StatusEmployee } from '../../Model/Model';
import { MasterAdmine } from '../../Service/MasterAdmine';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-bio-data',
  standalone: true,
  imports: [TableModule],
  templateUrl: './bio-data.component.html',
  styleUrl: './bio-data.component.scss'
})
export class BioDataComponent implements OnInit {

  dtEmployee: Employee[] = [];
  dtleaves: Leave[] = [];
  dtResign: Resignation[] = [];
  dtStatus: StatusEmployee[] = [];
  filteredEmployees: any[] = [];
  totalEmployees = 0;
  workingEmployeeCount = 0;
  TotalResign = 0;
  TotalLeave = 0;
  HrCount = 0;
  TesterCount = 0;
  DeveloperCount = 0;
  ITSupportCount = 0;

  constructor(private messageService: MessageService,
    private service: MasterAdmine,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.loadAllEmployees();
    this.WorkingEmployees();
    this.LeaveEmployees();
    this.ResignEmployees();
  }

  ResignEmployees() {
    this.spinner.show();
    this.service.ResignationGetResign().subscribe({
      next: (Data: any) => {
        //  console.log('FIRST RECORD:', Data?.Data?.Value?.[0]);
        console.log("get data", Data);
        const dtResign = Array.isArray(Data?.Data?.Value)
          ? Data.Data.Value
          : [];
          
        this.dtResign = dtResign.filter(
          (item: any) => item.ResignStatus === 'Approved'
        );
        this.TotalResign = this.dtResign.length;
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Get Data Succesfully',
          life: 2000
        });
        this.spinner.hide();
      },
      error: (err) =>
        this.messageService.add({
          key: 'account',
          severity: 'warn',
          summary: 'Error',
          detail: 'Data cannot get',
          life: 2000
        })
    })
  }

  LeaveEmployees() {
    this.spinner.show();
    this.service.getallleave().subscribe({
      next: (Data: any) => {
        //  console.log("get data", Data);
        const dtleaves = Array.isArray(Data.Data) ? Data.Data : [];
        this.dtleaves = dtleaves.filter(
          (item: any) => item.Status === 'Approved'
        );
        this.TotalLeave = this.dtleaves.length;

        this.TotalEmployees()

        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Get Data Succesfully',
          life: 2000
        });

        this.spinner.hide();
      },
      error: (err) => {
        this.messageService.add({
          key: 'account',
          severity: 'warn',
          summary: 'Error',
          detail: 'Data cannot get',
          life: 2000
        })
      }
    })
  }

  TotalEmployees() {
    this.totalEmployees =
      this.workingEmployeeCount +
      this.TotalLeave;

  }

  WorkingEmployees() {
    this.spinner.show();
    this.service.Employeegetemployee().subscribe({
      next: (data: any) => {
        this.dtEmployee = Array.isArray(data.Data) ? data.Data : [];
        this.workingEmployeeCount = this.dtEmployee.length;

        this.TotalEmployees()
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

  loadAllEmployees() {
    this.spinner.show();

    this.service.GetAllStatusEmployee().subscribe({
      next: (res: any) => {
        this.dtStatus = Array.isArray(res.Data) ? res.Data : [];

        // counts
        this.HrCount = this.dtStatus.filter(e => e.Jobrole === 'HR').length;
        this.TesterCount = this.dtStatus.filter(e => e.Jobrole === 'Tester').length;
        this.DeveloperCount = this.dtStatus.filter(e => e.Jobrole === 'Developer').length;
        this.ITSupportCount = this.dtStatus.filter(e => e.Jobrole === 'IT Support').length;

        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      }
    });
  }

  HrEmployees() {
    this.filteredEmployees =
      this.dtStatus.filter(e => e.Jobrole === 'HR');
  }
  ITEmployees() {
    this.filteredEmployees =
      this.dtStatus.filter(e => e.Jobrole === 'Tester');
  }
  TesterEmployees() {
    this.filteredEmployees =
      this.dtStatus.filter(e => e.Jobrole === 'Developer');
  }
  DeveloperEmployees() {
    this.filteredEmployees =
      this.dtStatus.filter(e => e.Jobrole === 'IT Support');
  }


}
