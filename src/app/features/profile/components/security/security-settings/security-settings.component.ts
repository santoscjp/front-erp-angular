import { Component, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { User } from '@core/interfaces/api/user.interface'
import { selectUser } from '@core/states/auth/auth.selectors'

@Component({
  selector: 'security-settings',
  standalone: false,
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.scss',
})
export class SecuritySettingsComponent {
  public user$: Observable<User | null> = inject(Store).select(selectUser)
}
