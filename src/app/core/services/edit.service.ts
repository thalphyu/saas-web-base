import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// const updateAction = 'update';
const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
      if (data[idx].ProductID === item.ProductID) {
          return idx;
      }
  }

  return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable({
  providedIn: 'root'
})
export class EditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];

  constructor(private http: HttpClient) {
    super([]);
  }
  public read() {
    if (this.data.length) {
        return super.next(this.data);
    }

    this.fetch()
        .subscribe(data => {
            this.data = data;
            this.originalData = cloneData(data);
            super.next(data);
        });
}

  public isNew(item: any): boolean {
    return !item.ProductID;
  }

  public update(item: any): void {
    if (!this.isNew(item)) {
      const index = itemIndex(item, this.updatedItems);
      if (index !== -1) {
        this.updatedItems.splice(index, 1, item);
      } else {
        this.updatedItems.push(item);
      }
    } else {
      const index = this.createdItems.indexOf(item);
      this.createdItems.splice(index, 1, item);
    }
  }
  public assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }
  private fetch(action: string = '', data?: any): Observable<any[]> {
    return this.http

        .jsonp(`https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(data)}`, 'callback')
        .pipe(map(res => res as any));
}

private serializeModels(data?: any): string {
  return data ? `&models=${JSON.stringify(data)}` : '';
}
}
