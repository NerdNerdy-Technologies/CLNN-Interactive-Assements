import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksheetComponent } from './common/worksheet/worksheet.component';

const routes: Routes = [
  { path: '', redirectTo: 'worksheet', pathMatch: 'full' },
  { path: 'worksheet', component: WorksheetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
