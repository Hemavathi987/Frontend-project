import { Observable, retry } from "rxjs";
import { environment } from "../../Folder/Environment.prod";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../Au/AuthenticationService";
import { GatePass } from "../Model/Model";

@Injectable({
    providedIn: 'root'
})
export class MasterGatePass {

    constructor(private http: HttpClient,
        private auth: AuthenticationService
    ) { }
    private account: string = environment.baseUrl

    allgateall(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.account + 'all-gateall', { params: param });
    }

    AddGatepass(gatepass: GatePass): Observable<any> {
        gatepass.AppUserId = this.auth.UserID();
        gatepass.ConnName = this.auth.CompConn();
        return this.http.post(this.account + 'Add-Gatepass', gatepass,
            {
                headers: { 'Content-Type': 'application/json' }
            });
    }

    UpdateGatepass(gatepass: GatePass): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.put(
            `${this.account}Update-Gatepass/${gatepass.EmployeeName}/${gatepass.CompId}`, gatepass
            , {
                params: param,
                headers: { 'Content-Type': 'application/json' }
            })
    }

    StatusCheck(EmployeeName: string, CompId: number): Observable<any> {
        const params = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());

        return this.http.get( this.account + 'id-Gatepass/' + encodeURIComponent(EmployeeName) + '/' + CompId, { params }
        );
    }
    //Gate Pass Approove
    GatepassStatusPending(): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn());
        return this.http.get(this.account + 'GatepassStatus/Pending', { params: param });
    }

    GatePassApprove(GatePass: GatePass): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.put(this.account + 'GatepassStatus/Approve/' + GatePass.EmployeeName + '/' + GatePass.CompId, { params: param })
    }

    GatePassReject(GatePass: GatePass): Observable<any> {
        const param = new HttpParams()
            .set('appUserId', this.auth.UserID())
            .set('connName', this.auth.CompConn())
        return this.http.put(this.account + 'GatepassStatus/Reject/' + GatePass.EmployeeName + '/' + GatePass.CompId, { params: param })
    }
}