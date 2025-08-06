import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { AuthSigninComponent } from './auth/auth-pages/auth-signin/auth-signin.component';
import { AuthSignupComponent } from './auth/auth-pages/auth-signup/auth-signup.component';
import { AuthPassResetComponent } from './auth/auth-pages/auth-pass-reset/auth-pass-reset.component';
import { AuthLockscreenComponent } from './auth/auth-pages/auth-lockscreen/auth-lockscreen.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'pages/dashboard',
        pathMatch: 'full',
    },
    // {
    //     path: 'auth',
    //     component: AuthComponent,
    //     children: [
    //         { path: '', redirectTo: 'auth-signin', pathMatch: 'full' },
    //         { path: 'auth-signin', component: AuthSigninComponent },
    //         { path: 'auth-signup', component: AuthSignupComponent },
    //         { path: 'auth-pass-reset', component: AuthPassResetComponent },
    //         { path: 'auth-lockscreen', component: AuthLockscreenComponent },
    //     ],
    // },
    {
        path: 'pages',
        component: LayoutComponent,
        // canActivate: [AuthGuard], // Guard applied at the parent level
        loadChildren: () =>
            import('./layouts/layout.route').then((mod) => mod.PAGE_ROUTES),
    },
];
