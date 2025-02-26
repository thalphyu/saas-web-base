import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthGuard } from './shared';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

const routerOptions: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64],
    useHash: true,
    relativeLinkResolution: 'legacy',
    onSameUrlNavigation: 'reload'
};
const routes: Routes = [
	 { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
	 { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
	 { path: 'login/forgotpassword/:ID', loadChildren: () => import('./forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordModule) },
	 { path: 'error', loadChildren: () => import('./server-error/server-error.module').then(m => m.ServerErrorModule) },
	 { path: 'access-denied', loadChildren: () => import('./access-denied/access-denied.module').then(m => m.AccessDeniedModule) },
	 { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
	 { path: 'login/terms-and-condition', loadChildren: () => import('./terms-and-condition/terms-and-condition.module').then(m => m.TermsAndConditionModule) },
	 { path: 'login/privacy-policy', loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)},
	 { path: '**', redirectTo: 'not-found' }
];

@NgModule({
	 imports: [RouterModule.forRoot(routes, routerOptions)],
	 exports: [RouterModule],
	 providers: [{ provide: APP_BASE_HREF, useValue: window.location.pathname.split('/')[0] }]

})
export class AppRoutingModule { }

