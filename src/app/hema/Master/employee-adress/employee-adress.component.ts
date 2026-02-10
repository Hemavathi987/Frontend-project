import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { MasterEmployyAdressService } from '../../Service/employee.adress.service';
import { ToastModule } from 'primeng/toast';
import { Employee, EmployeeAdress, EmployeeUpdateDTO, Photo, StatusEmployee } from '../../Model/Model';
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
import { Router } from '@angular/router';
import { MasterService } from '../../Service/Service';
import html2pdf from 'html2pdf.js';
type EmployeeAction = 'VIEW' | 'PDF';


@Component({
  selector: 'app-employee-adress',
  standalone: true,
  imports: [ToastModule, TableModule, CalendarModule, PaginatorModule, AccordionModule, CommonModule, ToolbarModule, ReactiveFormsModule, DialogModule, ButtonDirective, TooltipModule],
  providers: [MessageService, NgxSpinnerService],
  templateUrl: './employee-adress.component.html',
  styleUrl: './employee-adress.component.scss'
})
export class EmployeeAdressComponent implements OnInit {

  dtPhoto: Photo[] = [];
  Adress: EmployeeAdress = {};
  displayPopup: boolean = false;
  dtAdress: EmployeeAdress[] = [];
  dtEmployee: Employee[] = [];
  dtStatus: StatusEmployee[] = [];
  AdressForm!: FormGroup;
  index: any;
  SelectRecord: any;
  cols: any[] = [];
  displayUpdate = false;
  displaydelete = false;
  isEditMode = false;
  displayViewPopup = false;
  displayEditPopup = false;
  isupdatemode: boolean = false;
  iseditmode: boolean = false;
  EditForm!: FormGroup;


  ngOnInit(): void {
    this.ValidationForm();
    this.valid();
    this.getAdress();

  }


  constructor(
    private fb: FormBuilder,
    private masterservice: MasterEmployyAdressService,
    private spinner: NgxSpinnerService,
    private messageservice: MessageService,
    private router: Router,
    private mastetService: MasterService
  ) { }


  valid() {
    this.EditForm = this.fb.group({
      CompanyId: ['', Validators.required],
      Name: ['', Validators.required],
      Age: [''],
      Email: [''],
      DOB: [''],
      PhoneNumber: [''],
      PhotoBase: [''],
      Qualification: [''],
      Department: [''],
      Jobrole: [''],
      DOJ: [''],
      Label: [''],
      Address1: [''],
      Address2: [''],
      Address3: [''],
      Address4: [''],
      City: [''],
      State: [''],
      Pincode: [''],
      Country: ['']
    });
  }




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
    this.isupdatemode = false;
    this.AdressForm.reset();
    this.index = 1;
    this.SelectRecord.null;
  }

  onRowSelect() {
    this.isupdatemode = true;
    this.AdressForm.patchValue(this.SelectRecord);

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




  onGlobalFilter(table: Table, event: Event) {
    onGlobalTableFilter(table, event);
  }


  Save() {
    if (this.AdressForm.valid) {
      this.spinner.show();
      this.AdressForm.value.Id =
        this.AdressForm.value.Id === null ? 0 :
          this.AdressForm.value.Id;

      const SetTime: Date = new Date(this.AdressForm.value.UpdatedDate);

      const Payload = {
        ...this.AdressForm.value,
        UpdatedDate: formatDate(SetTime, 'yyyy-MM-ddTHH:mm:ss', 'en-Us')
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
    this.masterservice.iddeletemployeeadress(this.AdressForm.value.EmpName,this.AdressForm.value.CompanyId).subscribe({
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
            if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Delete the Data.',
            life: 4000,
          });
          return;
        }
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
            if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Update the Data.',
            life: 4000,
          });
          return;
        }
        this.spinner.hide();
      }
    });
  }


  Previous() {
    this.router.navigate(['/master/employee/status']);
  }



  Next() {
    this.displayEditPopup = false;
    const compId = this.AdressForm.value.CompanyId;//gives you all the current values of the form as a plain object.
    const empName = this.AdressForm.value.EmpName;  // or from form/control  
    this.getEmployee2(compId, empName, 'VIEW');
  }

  getEmployee2(CompId: number, EmpName: string, action: EmployeeAction) {
    if (!this.validateBasicFields())
      return;
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
            Email: empData.Email,
            DOB: empData.DOB
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
            Department: empData.Department,
            Jobrole: empData.Jobrole,
            DOJ: empData.DOJ
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
          if (action === 'VIEW') {
            this.displayViewPopup = true;
          }

          if (action === 'PDF') {
            this.displayViewPopup = true; // ensure content is visible
            setTimeout(() => {
              this.generatePDF();
            }, 300); // 👈 critical
          }


          this.messageservice.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Employee contain all the information',
            life: 3000
          });

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
        if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Get the Data.',
            life: 4000,
          });
          return;
        }
      },
    });
  }

  SendEmail() {
    this.displayEditPopup = false;
    const compId = this.AdressForm.value.CompanyId;//gives you all the current values of the form as a plain object.
    const empName = this.AdressForm.value.EmpName;  // or from form/control  
    this.SendEmailgetEmployee2(compId, empName);
  }
  SendEmailgetEmployee2(CompId: number, EmpName: string) {
    if (!this.validateBasicFields())
      return;
    this.spinner.show();

    this.mastetService.EmailAlredycreatedfullemployeeInformation(CompId, EmpName).subscribe({
      next: (data: any) => {
        console.log('🟢 Full API raw response:', data);
        const res = data?.body ? data.body : data;

        if (res?.Status?.toLowerCase?.() === 'success' && res?.Data) {
          const empData = res.Data;

          this.dtEmployee = [{
            CompanyId: empData.CompanyId,
            Name: empData.Name,
            Age: empData.Age,
            Email: empData.Email,
            DOB: empData.DOB
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
            Department: empData.Department,
            DOJ: empData.DOJ,
            Jobrole: empData.Jobrole
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
          this.displayViewPopup = true;

          this.messageservice.add({
            key: 'account',
            severity: 'success',
            summary: 'Success',
            detail: 'Employee contain all the information',
            life: 3000
          });

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
        if (err.status === 403 || err.status === 400) {
          this.messageservice.add({
            key: 'account',
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You are no longer an employee. Cannot Send  Email.',
            life: 4000,
          });
          return;
        }
      },
    });
  }

  Edit() {
    if (!this.validateBasicFields()) return;
    if (
      this.dtEmployee.length === 0 ||
      this.dtAdress.length === 0 ||
      this.dtStatus.length === 0
    ) {
      this.ShowMessageEdit()
      return;
    }
    // Reset the form
    this.EditForm.reset();
    // Patch with actual data
    this.EditForm.patchValue({
      CompanyId: this.dtEmployee[0].CompanyId,
      Name: this.dtEmployee[0].Name,
      Age: this.dtEmployee[0].Age,
      Email: this.dtEmployee[0].Email,
      DOB: this.dtEmployee[0].DOB,

      PhoneNumber: this.dtStatus[0].PhoneNumber,
      Qualification: this.dtStatus[0].Qualification,
      Department: this.dtStatus[0].Department,
      Jobrole: this.dtStatus[0].Jobrole,
      DOJ: this.dtStatus[0].DOJ,

      PhotoBase: this.dtPhoto[0].PhotoBase,

      Address1: this.dtAdress[0].Address1,
      Address2: this.dtAdress[0].Address2,
      Address3: this.dtAdress[0].Address3,
      Address4: this.dtAdress[0].Address4,
      City: this.dtAdress[0].City,
      State: this.dtAdress[0].State,
      Pincode: this.dtAdress[0].Pincode,
      Country: this.dtAdress[0].Country,

      UpdatedDate: new Date()
    });
    // Only after patching, open the dialog
    this.displayEditPopup = true;
    this.displayViewPopup = false;

    console.log('Edit Form Values:', this.EditForm.value);
  }


  UpdateEmployeeDetails() {
    if (this.EditForm.invalid) return;

    const compId = this.EditForm.get('CompanyId')?.value;//get('CompanyId') returns the FormControl object for CompanyId.
    const empName = this.EditForm.get('Name')?.value;

    if (!compId || !empName) {
      console.log('CompanyId or EmpName missing', { compId, empName });
      return;
    }
    this.spinner.show();
    const payload: EmployeeUpdateDTO = {
      ...this.EditForm.value,
      UpdatedDate: new Date()
    };

    this.masterservice.UpdateEmployeeDetails(compId, empName, payload).subscribe({
      next: () => {
        this.spinner.hide();
        this.displayEditPopup = false; // Close edit popup
        this.messageservice.add({
          key: 'account',
          severity: 'success',
          summary: 'Success',
          detail: 'Updated successfully'
        });
      },
      error: (err) => {
        this.spinner.hide();
        this.messageservice.add({
          key: 'account',
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.Message || 'Update failed'
        });
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

 ShowMessageEdit() {
  this.messageservice.add({
    key: 'account',
    severity: 'warn',
    summary: 'Warning',
    detail: 'Please check Full Information Employee Details Before Editing',
    life: 3000
  });
}



  validateBasicFields(): boolean {
    const companyId = this.AdressForm.get('CompanyId');//This returns the FormControl object itself.
    const empName = this.AdressForm.get('EmpName');
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


  generatePDF() {
    const element = document.getElementById('pdfContents');
    if (!element) return;
    const options: any = {
      margin: 10,
      filename: 'Employee_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };
    html2pdf().from(element).set(options).save();
  }


  PDF() {
    this.displayEditPopup = false;
    const compId = this.AdressForm.value.CompanyId;//gives you all the current values of the form as a plain object.
    const empName = this.AdressForm.value.EmpName;  // or from form/control  
    this.getEmployee2(compId, empName, 'PDF');
  }


}


