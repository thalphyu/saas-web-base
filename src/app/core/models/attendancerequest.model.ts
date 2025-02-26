import { Time } from '@angular/common';


export class AttendanceRequest{

     AttendanceRequestID: number;
     EmployeeID: number;
    AttendanceFromDate: Date;
    AttendanceToDate: Date;
    AttendanceType: number;
    RequestType: number;
    Reason: string;
    IsApprove: boolean;
    ApprovePersonID: number;
    RequestFrom: Time;
    RequestTo: Time;
    ApproveFrom: Time;
    ApproveTo: Time;
    ApproveReason: string;
    CreatedDate: Date;
    CustomerID: number;
    LastModifiedDate: Time;




}
