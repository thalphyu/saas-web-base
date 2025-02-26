import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService, LocalStorageService } from '../services';
 import { map } from 'rxjs/operators';
import 'rxjs/add/operator/do' ;
import { Router } from '@angular/router';
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService,
    private jwtService: JwtService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {};
    const token = this.jwtService.getToken();
    //const url =  window.location.pathname;
    let customerurl = this.localStorageService.getItem('customerurl');//url.replace("/", "");
    if(!customerurl){
     const tempurl = window.location.pathname;
		const tmpurl = tempurl.split('/');
		const url = tmpurl[tmpurl.length - 1];
    customerurl = url;
    }

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
      headersConfig['myOrigin'] = customerurl;
      const authData =this.localStorageService.getItem('authorizationData');
        if (!authData){
          this.router.navigate(['/login']);
        }

    }
    else {
      headersConfig['myOrigin'] = customerurl;
    }

    const request = req.clone({ setHeaders: headersConfig });

    return next.handle(request)
      .do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // process successful responses here
          const newToken = event.headers.get('newToken');
          if (newToken) {
           // const authorizationData = JSON.parse(this.localStorageService.getItem('authorizationData'));
           // authorizationData.token = newToken;
           // this.localStorageService.setItemObj('authorizationData', authorizationData);
            this.jwtService.saveToken(newToken);
          }
        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 400) {
            this.router.navigate(['/login']);
          /*   if (error.error == 'The Token has expired') {
              this.router.navigate(['/login']);
            } else {
              this.router.navigate(['/login']);
            } */
          }
        }
      });


  }
  checklogin() {
    const authData =this.localStorageService.getItem('authorizationData');
        if (!authData) {
      return true;
  }
  else {
    this.router.navigate(['/login']);
  }
  }

}

