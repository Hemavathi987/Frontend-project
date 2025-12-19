import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MasterLoginService } from '../../Service/login.service';
import { AuthenticationService } from '../../Au/AuthenticationService';
import { NgxSpinnerService } from 'ngx-spinner';
import { Password } from '../../Model/Model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule, ButtonModule, InputTextModule],
  templateUrl: './login.component.html',
  providers: [MessageService, NgxSpinnerService]
})
export class LoginComponent implements OnInit {


  passwordFieldType: string = 'password';
  valCheck: string[] = ['remember'];
  submitted: boolean = false;
  currentIndex!: number;
  loginUser: Password = {};
  passwordForm!: FormGroup;

  backgroundUrl: string = 'assets/images/hema.jpg.jpg';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private loginService: MasterLoginService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.initForm();
    this.checkAlreadyLoggedIn();
  }

  initForm() {
    this.passwordForm = this.fb.group({
      UserName: ['', Validators.required],
      Passwords: ['', Validators.required],
      Role: ['', Validators.required]

    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  checkAlreadyLoggedIn() {
    if (this.authService.CurrentUser()) {
      this.router.navigate(this.authService.UserHomePage());
    }
  }

  

  login() {
    if (this.passwordForm.valid) {
      this.submitted = true;
      const UserName = this.passwordForm.get('UserName')?.value;
      const Passwords = this.passwordForm.get('Passwords')?.value;
      const Role = this.passwordForm.get('Role')?.value;

      // ✅ Validate credentials
      if (UserName !== 'Hema' || Passwords !== 'He@123') {
        this.messageService.add({
          key: 'login',
          severity: 'error',
          summary: 'Invalid Credentials',
          detail: 'Please enter correct UserName and Password',
          life: 3000
        });
        return;
      }

      this.spinner.show();

      this.loginService.login(UserName, Passwords,Role).subscribe({
        next: (data) => {
          this.spinner.hide();

          const err = data?.Error;
          if (err) {
            this.messageService.add({
              key: 'login',
              severity: 'error',
              summary: 'Error',
              detail: err,
              life: 3000
            });
            return;
          }

          // ✅ Save token if available
          if (data?.Data?.Token) {
            localStorage.setItem('token', data.Data.Token);
          }
            if (data?.Data?.RefreshToken) {
            localStorage.setItem('RefreshToken', data.Data.RefreshToken);
          }
            if (data?.Data?.RefreshTokenExpiryTime) {
            localStorage.setItem('RefreshTokenExpiryTime', data.Data.RefreshTokenExpiryTime);
          }
          localStorage.setItem('role', Role);

          // Redirect based on role
          setTimeout(() => {
            if (Role.toLowerCase() === 'admin') {
              this.router.navigate(['/master/admine']);
            } else if (Role.toLowerCase() === 'employee') {
              this.router.navigate(['/master']);
            } else {
              this.router.navigate(['/master/login']);
            }
          }, 1000);
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Login error:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Oops! Something went wrong.',
            life: 3000
          });
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }


  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.togglePasswordVisibility();
      event.preventDefault();
    }
  }
}