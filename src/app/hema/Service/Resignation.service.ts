import { Observable, retry } from "rxjs";
import { environment } from "../../Folder/Environment.prod";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../Au/AuthenticationService";
import { Resignation } from "../Model/Model";

@Injectable({
    providedIn: 'root'
})
export class MasterResignation {

    constructor(private http: HttpClient,
        private auth: AuthenticationService
    ) { }
    private acount: string = environment.baseUrl

    ResignationGetNameResign( EmpName: string,CompId: number,): Observable<any> {
        const url = `${this.acount}Resignation/GetNameResign/${EmpName}/${CompId}`;
        return this.http.get(url, { headers: { 'Content-Type': 'application/json' } });
    }

    ResignationApplyResign(Resign: Resignation): Observable<any> {
        Resign.AppUserId = this.auth.UserID();
        Resign.ConnName = this.auth.CompConn();
        return this.http.post(this.acount + 'Resignation/ApplyResign', Resign,
            {
                headers: { 'Content-Type': 'application/json' }
            });
    }

    ResignationGetResign() : Observable<any>
    {
          const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.acount + 'resignApprove/GetResign', { params: param });
    }
    ResignationAllResign() : Observable<any>
    {
          const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.acount + 'resignApprove/AllResign', { params: param });
    }

    ResignationApproveResign(Resign: Resignation) : Observable<any>
    {
      const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.put(this.acount + 'resignApprove/ApproveResign/'+ Resign.EmpName+'/'+Resign.CompId, { params: param })
    }

     ResignationRejectResign(Resign: Resignation) : Observable<any>
    {
      const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.put(this.acount + 'resignApprove/RejectResign//'+ Resign.EmpName+'/'+Resign.CompId, { params: param })
    }
} 