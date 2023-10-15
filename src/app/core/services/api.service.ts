import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CONSTANTS, StreamType } from "../constant/constant";
import { Observable, catchError, map, retry, throwError } from "rxjs";
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

  sendOtp(number: string, otp: string): Observable<{ messaging_product: string, contacts: any, messages: any }> {
    const url = environment.WHATSAPP_URL;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('API-KEY', atob(environment.W_API_KEY));

    const payload = {
      "to": number,
      "recipient_type": "individual",
      "type": "template",
      "template": {
        "language": {
          "policy": "deterministic",
          "code": "en"
        },
        "name": "otp",
        "components": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": "OTP"
              },
              {
                "type": "text",
                "text": "Aayam Star Application login"
              },
              {
                "type": "text",
                "text": otp
              }
            ]
          }
        ]
      }
    };

    return this.http
      .post<{ messaging_product: string, contacts: any, messages: any }>(
        url,
        payload,
        { headers: headers }
      )
      .pipe(
        retry(1),
        map((res) => {
          return res;
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
    mobileNo: string,
    referredBy: string
  ): Observable<{ token: string, user: any, isNew: boolean }> {
    const payload = {
      mobileNo: mobileNo,
      referredBy: referredBy ?? ''
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

  getTestResultByUser(testId: string | number): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        '/result/getTestResultByUser' + '/' + testId 
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

  getAllScoreAndPoints(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_ALL_SCORE_POINTS
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getAllTests(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_ALL_TEST
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  deleteTest(testId:string): Observable<any> {
    return this.http
      .delete<CustomHttpResponse<any>>(
        '/test/deleteTest'
        + '/' + testId
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getAllUsers(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        '/users'
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }
  getAllResults():  Observable<any> {
    return this.http.get<CustomHttpResponse<any>>(
      '/result/getAllResultsDetails'
    )
  }
  generateRank(testId: string): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GENERATE_RANK + '/' + testId
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  sendWpMessage(payload:any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.SEND_WP_MESSAGES,
        payload
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
      
  }

  getResultByTest(testId: string): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_RESULT_BY_TEST + '/' + testId
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getTestDetails(testId: string | number): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_TEST_DETAIL + '/' + testId
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  addTestDetails(payload: any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.ADD_TEST_DETAIL,
        payload
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  sendScore(number: string, title: string, score: string, outOf: string): Observable<{ messaging_product: string, contacts: any, messages: any }> {
    const payload = {
      "to": number,
      "recipient_type": "individual",
      "type": "template",
      "template": {
        "language": {
          "policy": "deterministic",
          "code": "en"
        },
        "name": "aayam_start_makrs",
        "components": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": title + " test"
              },
              {
                "type": "text",
                "text": score + ''
              },
              {
                "type": "text",
                "text": outOf + ''
              },
              {
                "type": "text",
                "text": score + ''
              },
              {
                "type": "text",
                "text": outOf + ''
              }
            ]
          }
        ]
      }
    };

    return this.WPMessageTemplate(payload);
  }

  WPMessageTemplate(payload: any) {
    const url = environment.WHATSAPP_URL;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('API-KEY', atob(environment.W_API_KEY));

    return this.http
      .post<{ messaging_product: string, contacts: any, messages: any }>(
        url,
        payload,
        { headers: headers }
      )
      .pipe(
        retry(1),
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

}