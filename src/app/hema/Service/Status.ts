import { Observable, retry } from "rxjs";
import { environment } from "../../Folder/Environment.prod";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../Au/AuthenticationService";
import { GatePass, StatusEmployee } from "../Model/Model";

@Injectable({
    providedIn: 'root'
})

export class MasterStatus {

    constructor(
        private http: HttpClient,
        private auth: AuthenticationService
    ) { }
    private account: string = environment.baseUrl;


    GetAllStatusEmployee(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.get(this.account + 'Controller/Get-All-StatusEmployee', { params: param })
    }

    postEmployeeStatus(status: StatusEmployee) {
        status.AppUserId = this.auth.UserID();
        status.ConnName = this.auth.CompConn();
        return this.http.post(this.account + 'Controller/add-StatusEmployee', status,
            {
                headers: { 'Content-Type': 'application/json' }
            });
    }

    UpdateEmployeeStatus(Address: StatusEmployee): Observable<any> {

        const params = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());

        return this.http.put(
            `${this.account}Controller/update-StatusEmployee/${Address.EmpName}`,
            Address,
            {
                params: params,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    deleteEmployeeStatus(EmpName: string): Observable<any> {
        const params = new HttpParams()
            .set('EmpName', EmpName)
            .set('appUserID', this.auth.UserID())
            .set('ConnName', this.auth.CompConn());
        return this.http.delete(this.account + 'Controller/delete-StatusEmployee', { params });
    }

}