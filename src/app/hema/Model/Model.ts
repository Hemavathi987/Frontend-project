export interface Employee {

    Id?: number;
    CompanyId?: number;
    Name?: string;
    Age?: number;
    Email?: string;
    DOB?: Date,
    OTP?: string;
    AppUserId?: string;
    ConnName?: string;
}

export interface EmployeeAdress {

    Id?: number;
    CompanyId?: number;
    EmpName?: string;
    Label?: string;
    Address1?: string;
    Address2?: string;
    Address3?: string;
    Address4?: string;
    City?: string;
    State?: string;
    Pincode?: string;
    Country?: string;
    UpdatedDate?: Date;
    AppUserId?: string;
    ConnName?: string;
}

export interface GatePass {
    Id?: number;
    CompId?: number;
    EmployeeName?: string;
    Reason?: string;
    Status?: string;
    DateTime?: Date;
    CreatedDate?: Date;
    UpdatedDate?: Date;
    ReturningOn?: Date;
    IsPersonal?: boolean;
    IsReturning?: boolean;
    InTime?: Date;
    OutTime?: Date;
    AppUserId?: string;
    ConnName?: string;
}

export interface CheckINOUT {
    ID?: number;
    Empname?: string;
    CompanyId?: number;
    Shift?: string;
    EmpIn?: string;
    EmpOut?: string;
    Date?: Date;
    CheckInTime?: Date;
    CheckOutTime?: Date;
    AppUserId?: string;
    ConnName?: string;
}

export interface AddBankPassBook {
    id?: number;
    EmpName?: string;
    CompanyId?: number;
    BankName?: string;
    BankBranch?: string;
    AdharNumber?: number;
    AccountNumber?: string;
    TotalBalance?: number;
    AppUserId?: string;
    ConnName?: string;
}

export interface GatePassAproved {
    Id?: number;
    CompId?: number;
    EmployeeName?: string;
    Approved?: string;
    DateTime?: Date;
    Status?: string;
    UpdatedBy?: string;
    AppUserId?: string;
    ConnName?: string;
}

export interface Leave {
    Id?: number;
    CompanyId?: number;
    EmpName?: string;
    FromDate?: Date;
    ToDate?: Date;
    Reason?: string;
    Status?: string;
    EmpCode?: string;
    NoOfDays?: number;
    AppUserId?: string;
    ConnName?: string;
}

export interface SalaryCalculator {
    Id?: number;
    CompId?: number;
    EmpName?: string;
    EmpCode?: string;
    Code?: string;
    Type?: string;
    Amount?: number;
    CreatedBy?: string;
    CreatedDate?: Date;
    UpdatedDate?: Date;
    AppUserId?: string;
    ConnName?: string;
}

export interface StatusEmployee {
    Id?: number;
    CompanyId?: number;
    EmpName?: string;
    PhoneNumber?: number;
    Qualification?: string;
    Department?: string;
    DOJ?: Date;
    Jobrole?: string;
    OnBoarding?: string;
    AppUserId?: string;
    ConnName?: string;
}
export interface Password {
    Id?: number;
    UserName?: string;
    Passwords?: string;
    Role?: string;
    Token?: string
}
export interface Photo {
    Id?: number;
    CompanyId?: number;
    Name?: string;
    PhotoBase?: string;
    AppUserId?: string;
    ConnName?: string;
}
// employee-update.dto.ts
export interface EmployeeUpdateDTO {
    CompanyId?: number;
    Name?: string;
    Age?: number;
    Email?: string;
    PhoneNumber?: number;
    PhotoBase?: string;
    Qualification?: string;
    Department?: string;
    Label?: string;

    Address1?: string;
    Address2?: string;
    Address3?: string;
    Address4?: string;
    City?: string;
    State?: string;
    Pincode?: string;
    Country?: string;

    UpdatedDate?: Date;
}

export interface Resignation {
    Id?: number;
    EmpName?: string;
    CompId?: number;
    ResignStatus?: string;
    ResignApplyDate?: Date;
    ResignApproveDate?: Date;
    ResignReason?: string;
     AppUserId?: string;
    ConnName?: string;

}

export interface MonthlySalary {
    Id?: number;
    CompanyId?: number;
    Name?: string;
    Days?: number;
    DailyWages?: number;
    Salary?: number;
    LPA?: number;
    Tax?: number;
    PF?: number;
    HealthInsurance?: number;
    TotalSalaryPerYear?: number;
    MonthlySalaryEmployee?: number;
    Monthly?: string;
    Year?: number;
    AppUserId?: string;
    ConnName?: string;
}
