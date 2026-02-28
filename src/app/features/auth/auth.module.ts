import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { AuthRoutingModule } from './auth-routing.module'

// Pages
import { LoginComponent } from './pages/login/login.component'
import { BlockedComponent } from './pages/blocked/blocked.component'

@NgModule({
  declarations: [
    LoginComponent,
    BlockedComponent,
  ],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
