import { Observable } from "rxjs";
import { HttpClient,HttpParams } from "@angular/common/http";
import { environment } from "../../Folder/Environment.prod";
import { EmployeeAdressComponent } from "../Master/employee-adress/employee-adress.component";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../Au/AuthenticationService";
import { EmployeeAdress } from "../Model/Model";

@Injectable ({
    providedIn : "root"
})

export class MasterEmployyAdressService 
{
  constructor
   (private auth:AuthenticationService,
    private http:HttpClient){}
    private  acount : string = environment.baseUrl;

    GetAllEmployeeAdress() : Observable<any>
    {
       const param = new HttpParams()
       .set('appUserId',this.auth.UserID())
       .set('connName',this.auth.CompConn());
       return this.http.get(this.acount+'Get-All-EmployeeAdress', { params : param });
    }


    AddEmployeeAdress(Adress : EmployeeAdress) : Observable<any>
    {
        Adress.AppUserId = this.auth.UserID();
        Adress.ConnName = this.auth.CompConn();
        return this.http.post(this.acount+'Add-EmployeeAdress',Adress,
            {
             headers: { 'Content-Type': 'application/json' }
            });
    }

    UpdateEmployeeAdress(Adress : EmployeeAdress) : Observable<any>
    {
      const param = new HttpParams()
      .set('appUserId',this.auth.UserID())
      .set('connName',this.auth.CompConn());
   return this.http.put(
    `${this.acount}Update-EmployeeAdress/${Adress.EmpName}/${Adress.CompanyId}`, 
    Adress,{
        params:param,
         headers: { 'Content-Type': 'application/json' }
      })
    }

    iddeletemployeeadress(EmpName : string): Observable<any>
    {
        const params = new HttpParams()
        .set('EmpName',EmpName)
        .set('appUserID',this.auth.UserID())
        .set('ConnName',this.auth.CompConn());
        return this.http.delete(this.acount+'id-delete-employeeadress',{params});
    }


    //Report
   
}


