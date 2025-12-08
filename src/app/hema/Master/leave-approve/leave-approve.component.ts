import { Component } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { AccordionModule } from "primeng/accordion";
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Leave } from '../../Model/Model';
import { MasterLeave } from '../../Service/leave';
import { Table, TableModule } from "primeng/table";
import { CommonModule, DatePipe } from '@angular/common';
import { onGlobalTableFilter } from '../../../Folder/global.filter';
import { DialogModule } from "primeng/dialog";

@Component({
  selector: 'app-leave-approve',
  standalone: true,
 imports: [ToolbarModule, CommonModule, ToastModule, ReactiveFormsModule, ButtonModule, AccordionModule, TableModule, DialogModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './leave-approve.component.html',
  styleUrl: './leave-approve.component.scss'
})
export class LeaveApproveComponent {

   index: any;
  dtLeaves: Leave[] = [];
  SelectRecord: any;
  reject = false;
  aprove = false;
  ngOnInit(): void {
    this.getadmin();
  }

  constructor(private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private mastetService: MasterLeave,
  ) { }


  getadmin() {
    this.spinner.show();
    this.mastetService.Adminepending().subscribe({
      next: (data: any) => {
        console.log('To check the admin data', data);
        // this.dtEmployee = Array.isArray(data) && data.length ? data : [{ Id: 0 }];
        this.dtLeaves = data.Data || [];
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successful get Employee Leaves'
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

  onRowSelect(event: any) {
    this.SelectRecord = event.data;
}

  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event)
  }


  getApprove() {
 this.spinner.show();
    this.mastetService.AdmineApprove(this.SelectRecord).subscribe({
      next: (data: any) => {
        console.log('Successfully Approve the Leave', data);
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Approve the Leave'
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

  CloseDialagAproove() {
    this.aprove = false;
  }


  getReject() {
 this.spinner.show();
    this.mastetService.AdmineReject(this.SelectRecord).subscribe({
      next: (data: any) => {
        console.log('Successfully Reject the Leave', data);
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Reject the Leave'
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
        detail: 'Please select a Leave record to Approve',
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
        detail: 'Please select a Leave record to Reject',
        life: 3000,
      });
    }
  }

  OnTab(num: any) {
    this.index = num.index;
  }


}
