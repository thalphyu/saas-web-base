import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  // if your prefix keyword is static you can add like that
  // public prefix = "YourKey";
  public prefix = window.location.pathname.replace('/', '');

  getItem(key: string): string {
    return localStorage.getItem((this.prefix)+'.'+(key));
  }

  setItemObj(key: string,item: any) {
    localStorage.setItem((this.prefix)+'.'+(key), JSON.stringify(item));
  }
  setItemObjEn(key: string,item: any) {
    localStorage.setItem((this.prefix)+'.'+(key), item);
  }

  setItemString(key: string,item: string) {
    localStorage.setItem((this.prefix)+'.'+(key), item);
  }

  removeItem(key: string){
      localStorage.removeItem((this.prefix)+'.'+(key));
  }

  clearAll(){
      localStorage.clear();
  }

  Key(index: number){
      return localStorage.key(index);
  }

}
