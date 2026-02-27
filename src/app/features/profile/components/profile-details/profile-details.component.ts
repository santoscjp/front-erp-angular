import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { User } from '@core/interfaces/api/user.interface'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { GlobalService } from '@core/services/ui/global.service'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { UserActions } from '@core/states/auth/auth.actions'
import { environment } from '@environment/environment'
import { DomSanitizer } from '@angular/platform-browser'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { FilePreview } from '@core/interfaces/ui/file-preview.interface'
import Swal from 'sweetalert2'
import { ImageCompressionService } from '@core/services/ui/image-compression.service'

@Component({
  selector: 'profile-details',
  imports: [TranslatePipe, ReactiveFormsModule, NgbTooltipModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef

  public userProfile: User = {} as User
  public isEditing: boolean = false
  public profileForm: FormGroup = new FormGroup({})
  public originalFormValues: User = {} as User
  private baseUrl: string = environment.apiBaseUrl
  public userImage: string = ''
  public selectedFiles: FilePreview[] = []

  private _profileService = inject(GlobalService)
  private _fb = inject(FormBuilder)
  private store = inject(Store)
  private sanitizer = inject(DomSanitizer)
  private notificationService = inject(ToastrNotificationService)
  private translateService = inject(TranslateService)
  private imageCompressionService = inject(ImageCompressionService)

  ngOnInit(): void {
    this.getProfileData()
    this.profileForm = this.getConfigForm()
  }

  getProfileData(): void {
    this._profileService.profile.subscribe((profile) => {
      this.userProfile = profile
      this.userImage = profile.profilePhoto
        ? this.formatUrl(profile.profilePhoto)
        : 'assets/images/default-avatar.png'
      this.profileForm.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
      })
      this.originalFormValues = this.profileForm.value
    })
  }

  getConfigForm(): FormGroup {
    return (this.profileForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    }))
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing
  }

  private formatUrl(url?: string): string {
    if (!url) {
      return 'assets/images/default-avatar.png'
    }
    return this.baseUrl + '/' + url.replace(/ /g, '%20').replace(/\\/g, '/')
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click()
  }

  fileUrl(file: File): any {
    const url = URL.createObjectURL(file)
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0]
    if (file) {
      if (!this.isImageFile(file)) {
        const message = this.translateService.instant(
          'PROFILE.MY_PROFILE.ONLY_ALWAY_IMAGE'
        )
        this.notificationService.showNotification({
          type: 'success',
          message,
        })
        return
      }
      const compressedFile = await this.compressImage(file)
      const url = this.fileUrl(compressedFile)
      this.selectedFiles = [
        {
          file: compressedFile,
          urlFile: url,
        },
      ]
      this.showImagePreview(file)
    }
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/')
  }

  showImagePreview(file: File): void {
    const reader = new FileReader()
    reader.onload = () => {
      const newImagePreview = reader.result
      const title = this.translateService.instant('SWEET_ALERT.ARE_YOU_SURE')
      const text = this.translateService.instant(
        'PROFILE.SWEET_ALERT.CHANGE_PHOTO'
      )
      const confirmButton = this.translateService.instant(
        'SWEET_ALERT.YES_I_AM_SURE'
      )
      const cancelButton = this.translateService.instant('SWEET_ALERT.CANCEL')

      Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmButton,
        cancelButtonText: cancelButton,
        iconColor: '#8C98A1',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateUserProfilePicture()
        } else {
          const message = this.translateService.instant(
            'PROFILE.MY_PROFILE.CANCEL_CHANGE'
          )
          this.notificationService.showNotification({
            type: 'success',
            message,
          })
        }
        this.fileInput.nativeElement.value = ''
      })
    }
    reader.readAsDataURL(file)
  }

  compressImage(file: File): Promise<File> {
    return this.imageCompressionService.compressImage(file)
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

  updateUserProfilePicture(): void {
    const formData = new FormData()

    const file = this.selectedFiles[0].file

    formData.append('profilePhoto', file)

    this.store.dispatch(
      UserActions.requestUserProfileUpdate({ user: formData })
    )
  }
}
