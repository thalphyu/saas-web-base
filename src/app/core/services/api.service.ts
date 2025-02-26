import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString, toDataSourceRequest, DataSourceRequestState, translateDataSourceResultGroups } from '@progress/kendo-data-query';


const httpOptionsJson = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  })
};
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public loading: boolean;
  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  log(arg0: any): any {
    throw new Error('Method not implemented.');
  }

  // postAuth(path: string, body: object = {}): Observable<any> {
  //   return this.http.post(
  //     `${environment.api_url}${path}`,
  //     body, httpOptions
  //   ).pipe(catchError(this.formatErrors));
  // }

  post(path: string, body: any = null): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`, body
    ).pipe(
      map(response => response['data']),
      catchError(this.formatErrors)
    );
  }

  uploadFile(path: string, body) {
    return this.http.post(
      `${environment.api_url}${path}`, (body)
    );
  }
  uploadFileURL2(path: string, body) {
    return this.http.post(
      `${environment.api_url}${path}`, (body)
    );
  }
  ImportFile(path: string, body): Observable<GridDataResult> {
    return this.http.post(`${environment.api_url}${path}`, (body))
      .pipe(
        map(response => ({
          data: response['data']
        } as GridDataResult)),
      );
  }
  // grid post.
  fetchnewgrid_postJson(path: string, state: any): any {
    return this.http.post(`${environment.api_url}${path}`, state);
  }

  fetchgrid_postJson(path: string, state: any): Observable<GridDataResult> {
    return this.http.post(`${environment.api_url}${path}`, state)
      .pipe(
        map(response => ({
          data: response['data'],
          total: parseInt(response['dataFoundRowsCount'], 10),

        } as GridDataResult)),
      );
  }
  fetchgrid_postJson_gridstate(path: string, state: any): Observable<GridDataResult> {
    const hasGroups = state.group && state.group.length; this.loading = true;
    return this.http.post(`${environment.api_url}${path}`,
      { gridState: toDataSourceRequest(state) }).pipe(map(({ data, total }: GridDataResult) =>
        ({ data: hasGroups ? translateDataSourceResultGroups(data) : data, total, })), tap(() => this.loading = false));
  }

  fetchgridpostJson(path: string, state: any, postdata: any): Observable<GridDataResult> {
    const hasGroups = state.group && state.group.length; this.loading = true;
    return this.http.post(`${environment.api_url}${path}`,
      { gridState: toDataSourceRequest(state), data: postdata }).pipe(map(({ data, total }: GridDataResult) =>
        ({ data: hasGroups ? translateDataSourceResultGroups(data) : data, total, })), tap(() => this.loading = false));
  }

  fetchgridpostJson_DataSourceRequestState(path: string, state: DataSourceRequestState): Observable<GridDataResult> {
    const hasGroups = state.group && state.group.length;
    this.loading = true;
    return this.http.post(`${environment.api_url}${path}`, {gridState:toDataSourceRequest(state)} )
        .pipe(
          map((result: any) => ({
            data: hasGroups ? translateDataSourceResultGroups(result.Data) : result.Data,
            total: result.Total,
          } as GridDataResult)),
          tap(() => this.loading = false)
        );
  }

  fetchgridpostJsonForOpeningLeave(path: string, state: any, postdata: any): Observable<any> {
    const hasGroups = state.group && state.group.length; this.loading = true;
    return this.http.post(`${environment.api_url}${path}`,
      { gridState: toDataSourceRequest(state), data: postdata }).pipe(map(({ data, total }: any) =>
        ({ data: hasGroups ? translateDataSourceResultGroups(data) : data, total, })), tap(() => this.loading = false));
  }

  fetchgridpostJsonForRule(path: string, state: any, postdata: any): Observable<any> {
    const hasGroups = state.group && state.group.length; this.loading = true;
    return this.http.post(`${environment.api_url}${path}`,
      { gridState: toDataSourceRequest(state), data: postdata }).pipe(map(({ data, total,columns }: any) =>
        ({ data: hasGroups ? translateDataSourceResultGroups(data) : data, total,columns })), tap(() => this.loading = false));
  }

  postJsonESS(path: string, body: any): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body), httpOptionsJson
    ).pipe(
      map(response => response['data']),
      catchError(this.formatErrors)
    );
  }


  postJson(path: string, body: any = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body), httpOptionsJson
    ).pipe(
      map(response => response['data']),
      catchError(this.formatErrors)
    );
  }
  postJsonModel(path: string, body: any = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body), httpOptionsJson
    ).pipe(map(response => response['data']),
    catchError(this.handleError.bind(this)));
  }

  postmockJson(path: string, body: any): Observable<any> {
    return this.http.get(
      `${path}`
    ).pipe(
      map(response => response['data']),
      catchError(this.formatErrors)
    );
  }
  get(path: string): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  GetURL2(path: string): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(
      map(response => response['data']),
      catchError(this.formatErrors));
  }
  exportgrid_post(path: string, state: any, postdata: any): Observable<any> {
    const hasGroups = state.group && state.group.length;
    return this.http.post(`${environment.api_url}${path}`, { gridState: toDataSourceRequest(state), data: postdata })
      .pipe(map(response => response['data']),
        catchError(this.formatErrors));
  }
  postJsonForTree(path: string, body: any): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body), httpOptionsJson
    );
  }


  fetchgridpostJsonForDutyRoster(path: string, state: any, postdata: any): Observable<any> {
    const hasGroups = state.group && state.group.length; this.loading = true;
    return this.http.post(`${environment.api_url}${path}`,
      { gridState: toDataSourceRequest(state), data: postdata }).pipe(map(({ data, total,columns }: any) =>
        ({ data: hasGroups ? translateDataSourceResultGroups(data) : data, total,columns })), tap(() => this.loading = false));
  }

  getwithfullpath(path: string): Observable<any> {
    return this.http.get(`${path}`)
      .pipe(catchError(this.formatErrors));
  }
  postwithfullpath(path: string, body: any): Observable<any> {
    return this.http.post(
      `${path}`,
      JSON.stringify(body), httpOptionsJson
    ).pipe(
      map(response => response['data']),
      catchError(this.formatErrors)
    );
  }


  postJsonForDynamicDashboard(path: string, body: any): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body), httpOptionsJson
    ).pipe(
      map(response => response),
      catchError(this.formatErrors)
    );
  }


  private handleError<T>(error: any) {
    // if (error.error.data == 0) {
    //     this.modaldialogService.confirm('Invalid data', error.error.error, 'Ok', '');
    // }
    return throwError(error.error);
  }

}




