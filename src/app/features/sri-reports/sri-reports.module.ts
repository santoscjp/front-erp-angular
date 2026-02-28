import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { SriReportsRoutingModule } from './sri-reports-routing.module'
import { SriReportsComponent } from './pages/sri-reports.component'

@NgModule({
  declarations: [SriReportsComponent],
  imports: [SharedModule, SriReportsRoutingModule],
})
export class SriReportsModule {}
