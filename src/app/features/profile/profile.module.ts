import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { ProfileRoutingModule } from './profile-routing.module'

// Pages
import { ProfileComponent } from './pages/profile.component'

// Components
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component'
import { SecuritySettingsComponent } from './components/security/security-settings/security-settings.component'
import { ChangePasswordComponent } from './components/security/change-password/change-password.component'
import { QrConfigurationComponent } from './components/security/qr-configuration/qr-configuration.component'

@NgModule({
  declarations: [
    // Pages
    ProfileComponent,

    // Components
    ProfileDetailsComponent,
    SecuritySettingsComponent,
    ChangePasswordComponent,
    QrConfigurationComponent,
  ],
  imports: [SharedModule, ProfileRoutingModule],
})
export class ProfileModule {}
