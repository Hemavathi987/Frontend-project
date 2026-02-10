import { Observable, retry } from "rxjs";
import { environment } from "../../Folder/Environment.prod";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../Au/AuthenticationService";
import { MonthlySalary } from "../Model/Model";

@Injectable({
    providedIn: 'root'
})
export class MasterAdmine {

    constructor(private http: HttpClient,
        private auth: AuthenticationService
    ) { }
    private acount: string = environment.baseUrl

     getallleave(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.get(this.acount + 'Admin/get-all-leave', { params: param })
    }

    Employeegetemployee(): Observable<any> {
    let appUserId = this.auth.UserID();
    let connName = this.auth.CompConn();

    const params = new HttpParams()
      .set('appUserId', appUserId)
      .set('connName', connName);

    console.log('Employee GET params:', params.toString());

    return this.http.get(this.acount + 'Admin/get-employee', { params });
  }
    
  ResignationGetResign() : Observable<any>
    {
          const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.acount + 'Admin/GetResign', { params: param });
    }

     GetAllStatusEmployee(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.get(this.acount + 'Admin/Get-All-StatusEmployee', { params: param })
    }

} 