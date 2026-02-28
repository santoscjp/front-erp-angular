import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { RoleService } from '@core/services/api/role.service'
import { UserService } from '@core/services/api/user.service'
import { Role } from '@core/interfaces/api/rol.interface'
import { CommonModule } from '@angular/common'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { ToastrNotificationService } from '@core/services/ui/notification.service'

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup
  roles: Role[] = []

  @Output() userCreated = new EventEmitter<void>()
  private _modal = inject(NgbActiveModal)
  private _fb = inject(FormBuilder)
  private _roleService = inject(RoleService)
  private _userService = inject(UserService)
  private _notificationService = inject(ToastrNotificationService)
  private _translate = inject(TranslateService)
  constructor() {
    this.userForm = this._fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roleId: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadRoles()
  }

  loadRoles(): void {
    this._roleService.getAllRoles().subscribe(
      (res) => {
        this.roles = res.data.result || []
      },
      (error) => {
        console.error('Error al obtener roles', error)
      }
    )
  }

  createUser(): void {
    if (this.userForm.valid) {
      this._userService.createUser(this.userForm.value).subscribe(
        (response) => {
          this.userCreated.emit()
          this._modal.close(response.data)
        },
        (error) => {
          console.error('Error al crear usuario', error)
        }
      )
    } else {
      const message = this._translate.instant(
        'USER.ERRORS.ERROR_REQUIRED_FIELDS'
      )
      this._notificationService.showNotification({
        type: 'error',
        title: 'Error',
        message: message,
      })
    }
  }

  closeModal(): void {
    this._modal.close()
  }
}
