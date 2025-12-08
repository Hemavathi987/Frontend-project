import { Injectable } from "@angular/core";
import { environment } from "../../Folder/Environment.prod";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Leave } from "../Model/Model";
import { AuthenticationService } from "../Au/AuthenticationService";
import { ObjectUnsubscribedErrorCtor } from "rxjs/internal/util/ObjectUnsubscribedError";
import { Observable } from "rxjs";

@Injectable
    ({
        providedIn: "root",
    })
export class MasterLeave {
    constructor(
        private auth: AuthenticationService,
        private http: HttpClient
    ) { }
    private account: string = environment.baseUrl;



    // get-all-leave
    getallleave(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.get(this.account + 'get-all-leave', { params: param })
    }
    //add-Leave
    addLeave(leave: Leave): Observable<any> {
        leave.AppUserId = this.auth.UserID();
        leave.ConnName = this.auth.CompConn();
        return this.http.post(this.account + 'add-Leave', leave, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    //check Status
    getidLeave(EmpName : string): Observable<any> {
  const params = new HttpParams()
       .set('EmpName',EmpName)
        .set('appUserID',this.auth.UserID())
        .set('ConnName',this.auth.CompConn());
        return this.http.get(this.account+'get-id-Leave/'+EmpName,{params});
    }
    //ADMINE
    Adminepending(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.get(this.account + 'LeaveStatus/pending', { params: param })
    }

    AdmineApprove(Leave: Leave): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.put(this.account + 'LeaveStatus/approve/' + Leave.EmpName, { params: param })
    }

    AdmineReject(Leave: Leave): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.put(this.account + 'LeaveStatus/reject/' + Leave.EmpName, { params: param })
    }
}