import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './pages/settings.component'

@NgModule({
  declarations: [SettingsComponent],
  imports: [SharedModule, SettingsRoutingModule],
})
export class SettingsModule {}
