import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../Folder/Environment.prod";
import { EmployeeAdressComponent } from "../Master/employee-adress/employee-adress.component";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../Au/AuthenticationService";
import { EmployeeAdress, EmployeeUpdateDTO } from "../Model/Model";

@Injectable({
    providedIn: "root"
})

//API (short-lived) → subscribe → BehaviorSubject.next(data) → components receive data
//In service state management:

//We call the API using HttpClient (this returns a short-lived Observable)

//We subscribe and get the data

//We store that data in a BehaviorSubject using .next(data)

//Multiple components subscribe to that BehaviorSubject and receive the same data
export class MasterEmployyAdressService {
    constructor
        (private auth: AuthenticationService,
            private http: HttpClient) { }
    private acount: string = environment.baseUrl;

    GetAllEmployeeAdress(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.acount + 'Get-All-EmployeeAdress', { params: param });
    }


    AddEmployeeAdress(Adress: EmployeeAdress): Observable<any> {
        Adress.AppUserId = this.auth.UserID();
        Adress.ConnName = this.auth.CompConn();
        return this.http.post(this.acount + 'Add-EmployeeAdress', Adress,
            {
                headers: { 'Content-Type': 'application/json' }
            });
    }

    UpdateEmployeeAdress(Adress: EmployeeAdress): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
             return this.http.put(`${this.acount}Update-EmployeeAdress/${Adress.EmpName}/${Adress.CompanyId}`,
            Adress, {params: param,headers: { 'Content-Type': 'application/json' }
        })
    }

    iddeletemployeeadress(EmpName: string,CompanyId : number): Observable<any> {
        const params = new HttpParams()
            .set('EmpName', EmpName)
            .set('CompanyId',CompanyId)
            .set('appUserID', this.auth.UserID())
            .set('ConnName', this.auth.CompConn());
        return this.http.delete(this.acount + 'id-delete-employeeadress', { params });
    }
    UpdateEmployeeDetails(
        CompId: number,
        EmpName: string,
        payload: EmployeeUpdateDTO
    ): Observable<any> {

        const url = `${this.acount}Employee/id-put-FullemployeeInformation/${CompId}/${EmpName}`;
        return this.http.put<any>(url, payload);
    }



}