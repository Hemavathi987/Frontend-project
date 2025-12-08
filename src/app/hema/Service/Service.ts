import { Injectable } from "@angular/core";
import { HttpClient,HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../Folder/Environment.prod";
import { AuthenticationService } from "../Au/AuthenticationService";
import { Employee } from "../Model/Model";

import { EmployeeAdressComponent } from "../Master/employee-adress/employee-adress.component";
@Injectable({
    providedIn: 'root',
})
export class MasterService {
    constructor(
        private http : HttpClient,
      
        private auth : AuthenticationService
    ){}
   private account:string = environment.baseUrl  ;



   Employeegetemployee( ): Observable<any> {
  let appUserId = this.auth.UserID();
  let connName = this.auth.CompConn();
  
  const params = new HttpParams()
    .set('appUserId', appUserId)
    .set('connName', connName);

  console.log('Employee GET params:', params.toString());
   
  return this.http.get(this.account + 'Employee/get-employee', { params });
}

   

   Employeeidgetemployee(Id : number) : Observable<any>
   {
      const params = new HttpParams()
      .set('Id',Id)
      .set('appUserId',this.auth.UserID())
      .set('connName',this.auth.CompConn());
      console.log('Employee GET params:', params.toString());
      return this.http.get(this.account+'Employee/id-get-employee/'+Id,{ params })
   }


   Employeeidpostemployee(employee : Employee) : Observable<any>
   {
     employee.AppUserId = this.auth.UserID();
     employee.ConnName = this.auth.CompConn();
   return this.http.post(this.account + 'Employee/id-post-employee', employee, {
  headers: { 'Content-Type': 'application/json' }
});
   }


    Employeeidputemployee(employee: Employee): Observable<any> {
    const param = new HttpParams()
      .set('appUserId', this.auth.UserID())
        .set('connName', this.auth.CompConn());

return this.http.put(this.account + 'Employee/id-put-employee/' + employee.Id, employee, {
  params: param,
  headers: { 'Content-Type': 'application/json' }
});
}    



Employeeiddeleteemployee(Id: number): Observable<any> {
  const params = new HttpParams()
    .set('Id', Id)
    .set('appUserId', this.auth.UserID())
    .set('connName', this.auth.CompConn());

  return this.http.delete(this.account + 'Employee/id-delete-employee', { params });
}

AlredycreatedfullemployeeInformation(CompId: number, EmpName: string): Observable<any> {
  const url = `${this.account}Employee/Alredy-created-full-employeeInformation-${CompId}-${EmpName}`;
  return this.http.get(url, { headers: { 'Content-Type': 'application/json' } });
}

 Reportreportname(EmpName : string) : Observable<any>
    {
      const params = new HttpParams()
       .set('EmpName',EmpName)
        .set('appUserID',this.auth.UserID())
        .set('ConnName',this.auth.CompConn());
        return this.http.get(this.account+'Report/report-name',{params});
    }
}