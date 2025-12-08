import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from "primeng/toolbar";
import { GatePass } from '../../Model/Model';
import { MasterGatePass } from '../../Service/gatepass';
import { onGlobalTableFilter } from '../../../Folder/global.filter';


@Component({
  selector: 'app-gatepass-aprrove',
  standalone: true,
  providers: [NgxSpinnerService, MessageService],
  imports: [ToolbarModule, CommonModule, ToastModule, ReactiveFormsModule, ButtonModule, AccordionModule, TableModule, DialogModule],
  templateUrl: './gatepass-aprrove.component.html',
  styleUrl: './gatepass-aprrove.component.scss'
})
export class GatepassAprroveComponent implements OnInit {
  index: any;
  dtGatepass: GatePass[] = [];
  SelectRecord: any;
  reject = false;
  aprove = false;

  ngOnInit(): void {
  this.getGetpass();
  }
  constructor(private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private mastetService: MasterGatePass,
  ) { }

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

  getGetpass()
  {
  this.spinner.show();
    this.mastetService.GatepassStatusPending().subscribe({
      next: (data: any) => {
        console.log('To check the GatePass data', data);
        // this.dtEmployee = Array.isArray(data) && data.length ? data : [{ Id: 0 }];
        this.dtGatepass = data.Data || [];
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successful get Employee GatePass'
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

getApprove()
{
 this.spinner.show();
    this.mastetService.GatePassApprove(this.SelectRecord).subscribe({
      next: (data: any) => {
        console.log('Successfully Approve the GatePass', data);
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Approve the GatePass'
        });
         this.aprove = false;

      // Optionally refresh the table
      this.getGetpass();
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
getReject()
{
this.spinner.show();
    this.mastetService.GatePassReject(this.SelectRecord).subscribe({
      next: (data: any) => {
        console.log('Successfully Reject the GatePass', data);
        this.messageService.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Reject the GatePass'
        });
      
         this.reject = false;

     
      this.getGetpass();

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
