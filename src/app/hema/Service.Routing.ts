import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { MasterModule } from "./Master/Master.Module";
const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('./Master/Master.Module').then(m => m.MasterModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRouting {}