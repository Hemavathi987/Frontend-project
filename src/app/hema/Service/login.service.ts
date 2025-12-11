// import { Observable } from "rxjs";
// import { environment } from "../../Folder/Environment.prod";
// import { HttpClient,HttpParams } from "@angular/common/http";
// import { LoginComponent } from "../Master/login/login.component";
// import { Password } from "../Model/Model";
// import { AuthenticationService } from "../Au/AuthenticationService";
// import { Injectable } from "@angular/core";
// import { trigger } from "@angular/animations";

// @Injectable({
//     providedIn:"root",
// })
// export class MasterLoginService{
//    constructor(
//         private http : HttpClient,
        
//         private auth : AuthenticationService
//     ){}  private account:string = environment.baseUrl  ;

// AddPassword(UserName: string, Passwords: string): Observable<any> {
//   const body = {   id: 0,UserName, Passwords }; // JSON body

//   return this.http.post(this.account + 'Add-Password', body, {
//     headers: { 'Content-Type': 'application/json' }
//   });
// }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterLoginService {
  private baseUrl = 'https://localhost:7087/Api/';

  constructor(private http: HttpClient) {}

  login(UserName: string, Passwords: string,Role : string): Observable<any> {
    const body = {
      id: 0,
      userName: UserName,
      passwords: Passwords,
      Role : Role
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.baseUrl + 'Add-Password', body, { headers });
  }

  refreshbutton(refreshToken: string): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const params = new HttpParams().set('refresh', refreshToken);

  return this.http.post(this.baseUrl + 'refresh-tocken', {}, { headers, params });
}

refreshToken() {
  let refresh = localStorage.getItem("refreshToken");

  return this.http.get<any>(`https://localhost:7087/Api/refresh-token?refresh=${refresh}`);
}
}
