import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('isLoggedin')) {
            const authData =localStorage.getItem('jwtToken');
            if (!authData){
              this.router.navigate(['/login']);
              return false;
            }
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
