import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { AccordionModule } from "primeng/accordion";
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Leave, Resignation } from '../../Model/Model';
import { MasterLeave } from '../../Service/leave';
import { Table, TableModule } from "primeng/table";
import { CommonModule, DatePipe } from '@angular/common';
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { DialogModule } from "primeng/dialog";
import { MasterResignation } from '../../Service/Resignation.service';


@Component({
  selector: 'app-check-resignation',
  standalone: true,
  imports: [ToolbarModule, CommonModule, ToastModule, ReactiveFormsModule, ButtonModule, AccordionModule, TableModule, DialogModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './check-resignation.component.html',
  styleUrl: './check-resignation.component.scss'
})
export class CheckResignationComponent implements OnInit {
  SelectRecord: any;
  reject = false;
  aprove = false;
  index : any;
  dtResign : Resignation[] = [];
  constructor(private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private masterResign: MasterResignation,
  ) { }

  ngOnInit(): void {
    this.getadmin();
  }

  onRowSelect(event: any) {
    this.SelectRecord = event.data;
  }

  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event)
  }

  CloseDialagAproove() {
    this.aprove = false;
  }

  CloseDialagReject() {
    this.reject = false;
  }

  OpenDilagApprove() {
    if (this.SelectRecord?.Id) {
      this.aprove = true;
    } else {
      this.messageService.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a Resignation record to Approve',
        life: 3000,
      });
    }
  }
  OpenDilagReject() {
    if (this.SelectRecord?.Id) {
      this.reject = true;
    } else {
      this.messageService.add({
        key: 'account',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a Resignation record to Reject',
        life: 3000,
      });
    }
  }

  OnTab(num: any) {
    this.index = num.index;
  }

  getReject() {
 this.spinner.show();
    this.masterResign.ResignationRejectResign(this.SelectRecord).subscribe({
      next: (data: any) => {
        console.log('Successfully Reject the Resignation', data);
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Reject the Resignation'
        });
      
         this.reject = false;

     
      this.getadmin();

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

  getApprove() {
 this.spinner.show();
    this.masterResign.ResignationApproveResign(this.SelectRecord).subscribe({
      next: (data: any) => {
        console.log('Successfully Approve the Resignation', data);
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Approve the Resignation'
        });
         this.aprove = false;

      // Optionally refresh the table
      this.getadmin();
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

   getadmin() {
    this.spinner.show();
    this.masterResign.ResignationAllResign().subscribe({
      next: (data: any) => {
        console.log('To check the admin data', data);
        // this.dtEmployee = Array.isArray(data) && data.length ? data : [{ Id: 0 }];
        this.dtResign = data.Data.Value || [];
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successful get Employee Resignation'
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


}

