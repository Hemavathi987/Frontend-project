import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard-admine',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './dashboard-admine.component.html',
  styleUrls: ['./dashboard-admine.component.scss']
})
export class DashboardAdmineComponent implements OnInit {
  role: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ✅ 1. Get role from localStorage
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      this.role = savedRole.toLowerCase();
    }

    // ✅ 2. Also check JWT token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const tokenRole =
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
          decoded['role'];
        if (tokenRole) {
          this.role = tokenRole.toLowerCase();
        }
      } catch (e) {
        console.warn('JWT decode failed:', e);
      }
    }

    console.log('✅ Final detected role:', this.role);
  }

  // ✅ 3. Navigation
  navigate(path: string) {
    if (this.role === 'admin') {
      this.router.navigate(['/master/admine', path]);
    } else {
      this.router.navigate(['/master', path]);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/master/login']);
  }
}
