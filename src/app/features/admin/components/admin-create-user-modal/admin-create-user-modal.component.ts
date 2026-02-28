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
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { RoleService } from '@core/services/api/role.service'
import { Role } from '@core/interfaces/api/rol.interface'
import { NgSelectModule } from '@ng-select/ng-select'

@Component({
  selector: 'app-admin-create-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
  ],
  templateUrl: './admin-create-user-modal.component.html',
  styleUrls: ['./admin-create-user-modal.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminCreateUserModalComponent implements OnInit {
  @Input() emisorId!: number
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
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleId: [null, [Validators.required]],
    })
  }

  private loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.data.result
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
