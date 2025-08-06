import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard/dashboard.component';
import { UserStrategyComponent } from '../pages/user-strategy/user-strategy.component';
import { AdminComponent } from '../pages/admin/admin.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { SettingsComponent } from '../pages/settings/settings.component';

export const PAGE_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  // { path: 'user-strategy', component: UserStrategyComponent },
  // { path: 'admin-kite', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin-kite', component: AdminComponent },
  { path: 'settings', component: SettingsComponent },
]
