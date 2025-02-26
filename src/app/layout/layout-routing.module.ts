import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: () => import('./dynamic-dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'changepassword', loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule) },
            { path: 'treeview', loadChildren: () => import('./treeview/treeview.module').then(m => m.TreeviewModule) },
            { path: 'app.company', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule) },
            { path: 'app.employee', loadChildren: () => import('./employee-setup/employee-setup.module').then(m => m.EmployeeSetupModule) },

            { path: 'app.division', loadChildren: () => import('./division/division.module').then(m => m.DivisionModule) },
            // { path: 'app.divisionnew', loadChildren: () => import('./division-new/division-new.module').then(m => m.DivisionNewModule) },

            { path: 'app.mailSetting', loadChildren: () => import('./mailsetting/mailsetting.module').then(m => m.MailsettingModule) },

            { path: 'app.passwordPolicy', loadChildren: () => import('./password-policy/password-policy.module').then(m => m.PasswordPolicyModule) },
            { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
            { path: 'app.eventViewerReport', loadChildren: () => import('./event-viewer/event-viewer.module').then(m => m.EventViewerModule) },
            { path: 'app.applicationOption', loadChildren: () => import('./application-option/application-option.module').then(m => m.ApplicationOptionModule) },
            { path: 'app.supervisordashboardreport', loadChildren: () => import('./dynamic-dashboard/dashboard.module').then(m => m.DashboardModule) },

            { path: 'app.smsSetting', loadChildren: () => import('./smssetting/smssetting.module').then(m => m.SmssettingModule) },
            { path: 'app.userLevelControl', loadChildren: () => import('./userlevelcontrol/userlevelcontrol.module').then(m => m.UserlevelcontrolModule) },
            { path: 'app.announcement', loadChildren: () => import('./announcemant/announcemant.module').then(m => m.AnnouncemantModule) },
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
