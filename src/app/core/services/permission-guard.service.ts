import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxPermissionsService } from '../../../../node_modules/ngx-permissions';
import { Globalfunction } from '../global/globalfunction';
import { LocalStorageService} from './localstorage.service';


@Injectable({
  providedIn: 'root'
})

export class PermissionGuardService implements CanActivate {
  public globalfunction: Globalfunction = new Globalfunction();

  constructor(private localStorageService: LocalStorageService,private router: Router, private permissionService: NgxPermissionsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const EnMenuList = this.globalfunction.decryptDataClient(this.localStorageService.getItem('menuList'));
    //this.localStorageService.getItem('menuList')
    if(EnMenuList === undefined ){
     this.router.navigate(['/login']);
    }
   else{
      const menulist = JSON.parse(EnMenuList);

      const routObj = this.FilterJsonRegExp(menulist, 'ControllerName', state.url.substring(1));
      if (routObj.length > 0 && routObj[0].Permission != null) {
        this.permissionService.loadPermissions(routObj[0].Permission.split(','));
        return true;
      } else {
        this.router.navigate(['/access-denied']);
        return false;
      }
   }


  }
   // json filter
   FilterJsonRegExp(jsonobj: any, field: string, value: string  ) {
    return jsonobj.filter(
    (jsonobj1)=> {
      const fieldregx = new RegExp(jsonobj1[field] + '$');
      const matchposition = value.search(fieldregx);
      return matchposition === 0;
    });
  }
}
