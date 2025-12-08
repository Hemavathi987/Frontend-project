import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  role: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      // Role claim from backend is stored here:
      this.role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded['role'] ||
        '';
      console.log('User Role:', this.role);
    }
  }
//jwtDecode(token) is a function from the jwt-decode library that takes a JWT 
// (JSON Web Token) string and decodes it into a readable JavaScript object without validating it.
  navigate(path: string) {
    this.router.navigate(['/master', path]);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/master/login']);
  }
}
