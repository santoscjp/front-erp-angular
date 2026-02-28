import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { RoleService } from '@core/services/api/role.service'
import { Role } from '@core/interfaces/api/rol.interface'
import { EmisorModule } from '@core/interfaces/api/company.interface'

@Component({
  selector: 'app-admin-create-user-modal',
  standalone: false,
  templateUrl: './admin-create-user-modal.component.html',
  styleUrls: ['./admin-create-user-modal.component.scss'],
})
export class AdminCreateUserModalComponent implements OnInit {
  @Input() emisorId!: number
  @Input() emisorModules: EmisorModule[] = []
  @Output() userCreated = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private modal = inject(NgbActiveModal)
  private adminService = inject(AdminEmisorService)
  private roleService = inject(RoleService)
  private notificationService = inject(ToastrNotificationService)
  private translate = inject(TranslateService)

  userForm!: FormGroup
  roles: Role[] = []
  isSubmitting = false

  ngOnInit(): void {
    this.initForm()
    this.loadRoles()
    this.applyUsernameValidation()
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleId: [null, [Validators.required]],
    })
  }

  private applyUsernameValidation(): void {
    const usernameControl = this.userForm.get('username')
    if (this.emisorHasInvoicing) {
      usernameControl?.setValidators([Validators.required, Validators.minLength(3)])
    } else {
      usernameControl?.clearValidators()
    }
    usernameControl?.updateValueAndValidity()
  }

  private loadRoles(): void {
    this.roleService.getSelectableRoles().subscribe({
      next: (response) => {
        this.roles = response.data
      },
    })
  }

  get f() {
    return this.userForm.controls
  }

  get emisorHasInvoicing(): boolean {
    return this.emisorModules.some(
      (m) => m.moduleKey === 'INVOICING' && m.isActive,
    )
  }

  onSubmit(): void {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched()
      this.notificationService.showNotification({
        type: 'error',
        title: 'Error',
        message: this.translate.instant('USER.ERRORS.ERROR_REQUIRED_FIELDS'),
      })
      return
    }

    this.isSubmitting = true
    this.adminService
      .createEmisorUser(this.emisorId, this.userForm.value)
      .subscribe({
        next: () => {
          this.isSubmitting = false
          this.userCreated.emit()
          this.modal.close()
        },
        error: () => {
          this.isSubmitting = false
        },
      })
  }

  onCancel(): void {
    this.modal.dismiss()
  }
}
