import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SriReportsComponent } from './pages/sri-reports.component'

const routes: Routes = [
  {
    path: '',
    component: SriReportsComponent,
    data: { title: 'SRI Reports' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SriReportsRoutingModule {}
