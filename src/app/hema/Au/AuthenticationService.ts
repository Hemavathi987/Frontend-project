import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserComp } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userId = "System";
  private compConn = "NEWConn";
  private userObjName = "currentUser";
  private compObjName = "currentCompany";
  private userCompObjName = "currentUserComps";
  private uCompObjName = "currentUComps";
  private userMenuObjName = "currentUserMenus";
  private userPreferObjName = "currentUserPreferences";
  private userSessionDataObjName = "currentUserSessionData";
  private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
  dialogVisible$ = this.dialogVisibleSubject.asObservable();

  constructor(
    private router: Router
    ) {}

     getToken(): string | null {
    return localStorage.getItem('token'); // where you saved token after login
  }
  
 public StoreLoginDate(data: any) {
  console.log("Login response in StoreLoginDate:", data);

  // Some APIs send user info in data.User, others in data.data
  const userInfo = data.Data || data.ObjectData || data.User || data.data;

  // if (userInfo) {
  //   // ✅ Save UserId and Connection Name safely
  //   sessionStorage.setItem("UserId", userInfo.id?.toString() || "System");
  //   sessionStorage.setItem("UserName", userInfo.userName || "System");
  //   sessionStorage.setItem("connName", data.Companies?.[0]?.ConnectString || "NEWConn");

  //   // Optional: store menus, preferences, etc.
  //   if (data.Companies)
  //     localStorage.setItem(this.userCompObjName, JSON.stringify(data.Companies));

  //   if (data.MenusNew)
  //     localStorage.setItem(this.userMenuObjName, JSON.stringify(data.MenusNew));

  //   if (data.Preference)
  //     localStorage.setItem(this.userPreferObjName, JSON.stringify(data.Preference));

  //   if (data.UserCompanies)
  //     localStorage.setItem(this.uCompObjName, JSON.stringify(data.UserCompanies));
  // } else {
  //   console.error("Invalid login response:", data);
  // }
   if (userInfo) {
    // ✅ Save login info to session storage
    sessionStorage.setItem("UserId", userInfo.Id?.toString() || "System");
    sessionStorage.setItem("UserName", userInfo.UserName || "System");
    sessionStorage.setItem("connName", data.Companies?.[0]?.ConnectString || "NEWConn");

    // Optional: Save other user-related data
    if (data.Companies)
      localStorage.setItem(this.userCompObjName, JSON.stringify(data.Companies));

    if (data.MenusNew)
      localStorage.setItem(this.userMenuObjName, JSON.stringify(data.MenusNew));

    if (data.Preference)
      localStorage.setItem(this.userPreferObjName, JSON.stringify(data.Preference));

    if (data.UserCompanies)
      localStorage.setItem(this.uCompObjName, JSON.stringify(data.UserCompanies));
  } else {
    console.error("Invalid login response:", data);
  }
}

  public LogOut(): void {
    localStorage.removeItem(this.userCompObjName);
    localStorage.removeItem(this.userObjName);
    localStorage.removeItem(this.userMenuObjName);
    localStorage.removeItem(this.userPreferObjName);
  }

  public checkUserIDNotNull()
  {
    let userID = sessionStorage.getItem('UserId') as string;
    if(userID == undefined || userID == "" || userID == null)
    {
      return false;
    }
    return true;
  }

  public UserID(){
    let userID = sessionStorage.getItem('UserId') as string;
    // if(userID == undefined || userID == "" || userID == null)
    // {
    //   localStorage.clear()
    //   this.dialogVisibleSubject.next(true);
    //   this.router.navigate(['/master/login']);
    // }
      if(!userID){
    sessionStorage.setItem("UserId", "System");
    sessionStorage.setItem("connName", "NEWConn");
    return "System";
  }

    return userID;
  }

  public CompConn(){
    return sessionStorage.getItem('connName') as string;
}

  public CurrentUser() {
    return JSON.parse(localStorage.getItem(this.userObjName)!);
  }

  public UserHomePage(){
    let routes = [];
   let homepage = '/master/employee';

    let userPref = JSON.parse(localStorage.getItem(this.userPreferObjName)!);
    if(userPref !== undefined && userPref !== null){
      if(userPref.HomePage !== undefined && userPref.HomePage !== null && userPref.HomePage !== ''){
        homepage = userPref.HomePage;
      }
    }
    routes.push(homepage);
    return routes;
  }

  public UserCompanies(): Array<UserComp> {
    const storedData = localStorage.getItem(this.uCompObjName);
    const result: Array<UserComp> = storedData ? JSON.parse(storedData) : [];
    return result;
}


  public EmpCode(): string {
    let _code: any = '';
    let userCompanies = this.UserCompanies();
    if (userCompanies !== undefined && userCompanies.length > 0) {
      let compConn = this.CompConn();
      if (compConn !== undefined && compConn !== null && compConn !== "") {
        let comp = userCompanies.filter(function (item) {
          return item.ConnName == compConn;
        })[0];
        if (comp !== undefined && comp !== null) {
          _code = comp.EmpCode;
        }
      } else {
        _code = userCompanies[0].EmpCode;
      }
    }
    return _code;
  }

  public UserMenus(){
    return JSON.parse(localStorage.getItem(this.userMenuObjName)!);
  }

}


