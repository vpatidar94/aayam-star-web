import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CONSTANTS, StreamType } from "../constant/constant";
import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { AlertService } from "./alert.service";
import { CustomHttpResponse } from "src/app/models/custom-http-response";
// import { env } from "process";
// import { environment } from "@env";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    // Add the event listener for storage change
    window.addEventListener("storage", this.handleStorageChange.bind(this));
  }

  user: any = {};

  getAccessToken(): string {
    const token: string = localStorage.getItem("token") ?? "";
    return token;
  }

  setAccessToken(value: string) {
    localStorage.setItem("token", value);
  }

  isLoggedIn(): boolean {
    const token: string = localStorage.getItem("token") ?? "";
    return !!token;
  }

  setUserDetails(user: any) {
    this.user = user
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    }
    else {
      this.logout();
      return false;
    }
  }

  sendOtp(number: string, message: string): Observable<{ token: string }> {
    const url = CONSTANTS.WHATSAPP_URL;
    const params = {
      number: number,
      type: "text",
      message: message,
      instance_id: "647B3C9AA8D0A",
      access_token: "0a3e27126c2c239bdf7f9128943ef9c0"
    }
    return this.http
      .get<{ Object: any, Message: string }>(
        url,
        { params: params }
      )
      .pipe(
        map((res) => {
          return res?.Object;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }


  // Handle storage change events
  handleStorageChange(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      // LocalStorage has changed
      switch (event.key) {
        case "token":
          if (!event.newValue) {
            // handle logout if no value found in token
            this.logout();
          }
          break;
      }
    }
  }

  // main api calling -----------------
  // ----------------------------------
  loginSignup(
    mobileNo: string
  ): Observable<{ token: string, user: any, isNew: boolean }> {
    const payload = {
      mobileNo: mobileNo,
    };
    return this.http
      .put<CustomHttpResponse<{ token: string, user: any, isNew: boolean }>>(
        CONSTANTS.API.LOGIN_SIGNUP,
        payload
      )
      .pipe(
        map((res) => {
          this.setAccessToken(res.data.token);
          return res.data;
        })
      );
  }

  // update name api calling
  updateName(
    payload: { name: string, stream: StreamType }
  ): Observable<CustomHttpResponse<any>> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.UPDATE_NAME,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }


  getQuestions(testId: string | number): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_TEST + '/' + testId
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  submitResult(payload: any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.SUBMIT_RESULT,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getDashboardDetails(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_DASHBOARD_DETAILS
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

}