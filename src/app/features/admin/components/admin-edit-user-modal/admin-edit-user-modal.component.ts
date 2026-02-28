import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { RoleService } from '@core/services/api/role.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { Role } from '@core/interfaces/api/rol.interface'
import { User } from '@core/interfaces/api/user.interface'

@Component({
  selector: 'app-admin-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NgSelectModule],
  templateUrl: './admin-edit-user-modal.component.html',
  styleUrls: ['./admin-edit-user-modal.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminEditUserModalComponent implements OnInit {
  @Input() user!: User
  @Output() userUpdated = new EventEmitter<void>()

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
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      roleId: [this.user.role?.id ?? null, [Validators.required]],
    })
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
      .updateEmisorUser(this.user.id, this.userForm.value)
      .subscribe({
        next: () => {
          this.isSubmitting = false
          this.userUpdated.emit()
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
