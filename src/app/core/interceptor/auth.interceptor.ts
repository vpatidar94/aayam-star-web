import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from 'src/app/models/custom-http-response';
import { CONSTANTS } from '../constant/constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private apiService: ApiService, private alertService: AlertService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<CustomHttpResponse<any>>> {
    const token = this.apiService.getAccessToken();
    if (token && request.url !== environment.WHATSAPP_URL) {
      request = request.clone({
        setHeaders: {
          Authorization: `${token}`,
        },
      });
    }


    const modifiedRequest = request.clone({
      url: (request.url === environment.WHATSAPP_URL ? '' : environment.BASE_API_URL) + request.url,
    });
    return next.handle(modifiedRequest).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
          case 403:
            if (request.url !== environment.WHATSAPP_URL) {
              this.alertService.error(error.error.error);
              this.apiService.logout();
            }
            break;
          case 400:
            this.alertService.error(error.error.error);
            break;
        }
        return throwError(() => error);
      })
    );
  }
}
