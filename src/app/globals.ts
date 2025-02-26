import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  //role: string = 'test';
  collapsed = false;
  sideOpen = false;
  mobile = false;
  storedTheme: string = localStorage.getItem('theme-color');
  storedSkin: string = localStorage.getItem('skin-color');
}
