import { Observable, retry } from "rxjs";
import { environment } from "../../Folder/Environment.prod";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../Au/AuthenticationService";
import { MonthlySalary } from "../Model/Model";

@Injectable({
    providedIn: 'root'
})
export class MasterSalary {

    constructor(private http: HttpClient,
        private auth: AuthenticationService
    ) { }
    private acount: string = environment.baseUrl

    CheckMonthlySalryAllemployee(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.acount + 'MonthlyCheckSalary/-Check-employee', { params: param });
    }
       CheckMonthlySalrySalaryName(CompId: number, EmpName: string): Observable<any> {
        const url = `${this.acount}MonthlyCheckSalary/SalaryEmployee-${CompId}-${EmpName}`;
        return this.http.get(url, { headers: { 'Content-Type': 'application/json' } });
    }
     MonthlySalryAllemployee(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.acount + 'MonthlySalry/-All-employee', { params: param });
    }

    MonthlySalrySalaryName(CompId: number, EmpName: string): Observable<any> {
        const url = `${this.acount}MonthlySalry/Salary-${CompId}-${EmpName}`;
        return this.http.get(url, { headers: { 'Content-Type': 'application/json' } });
    }
  

    MonthlySalrypostemployee(Salary: MonthlySalary): Observable<any> {
        Salary.AppUserId = this.auth.UserID();
        Salary.ConnName = this.auth.CompConn();
        return this.http.post(this.acount + 'MonthlySalry/post-employee', Salary,
            {
                headers: { 'Content-Type': 'application/json' }
            });
    }

    MonthlySalrydeleteemployee(Name: string) : Observable<any>
    {
     const params = new HttpParams()
            .set('Name', Name)
            .set('appUserID', this.auth.UserID())
            .set('ConnName', this.auth.CompConn());
        return this.http.delete(this.acount + 'MonthlySalry/delete-employee-Name', { params });
    }

    MonthlySalryputSalary(Salary : MonthlySalary) : Observable<any>
    {
          const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
             return this.http.put(`${this.acount}MonthlySalry/put-Salary/${Salary.CompanyId}/${Salary.Name}`,
            Salary, {params: param,headers: { 'Content-Type': 'application/json' }
        })
    }
    
} 