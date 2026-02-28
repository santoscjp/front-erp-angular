import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from '@core/interfaces/api/user.interface'
import { GlobalService } from '@core/services/ui/global.service'
import { Store } from '@ngrx/store'
import { UserActions } from '@core/states/auth/auth.actions'

@Component({
  selector: 'profile-details',
  standalone: false,
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent implements OnInit {
  public userProfile: User = {} as User
  public isEditing: boolean = false
  public profileForm: FormGroup = new FormGroup({})
  public originalFormValues: User = {} as User
  public userImage: string = 'assets/images/default-avatar.png'

  private _profileService = inject(GlobalService)
  private _fb = inject(FormBuilder)
  private store = inject(Store)

  ngOnInit(): void {
    this.getProfileData()
    this.profileForm = this.getConfigForm()
  }

  getProfileData(): void {
    this._profileService.profile.subscribe((profile) => {
      this.userProfile = profile
      this.profileForm.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
      })
      this.originalFormValues = this.profileForm.value
    })
  }

  getConfigForm(): FormGroup {
    return (this.profileForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    }))
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.store.dispatch(
        UserActions.requestUserProfileUpdate({ user: this.profileForm.value })
      )
      this.isEditing = false
      this.originalFormValues = this.profileForm.value
    }
  }
}
