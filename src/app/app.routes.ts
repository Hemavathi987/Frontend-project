import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
     path : '',
     redirectTo : 'master/login',
      pathMatch: 'full'
  },
  {
    path: 'master',
    loadChildren: () =>
      import('./hema/Service.Module').then(m => m.ServiceModule),
  },
  { path: '**', redirectTo: '/master/login' } // fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutes {}