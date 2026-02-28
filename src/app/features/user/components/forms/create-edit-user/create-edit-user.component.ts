import { Component, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { Role } from '@core/interfaces/api/rol.interface'
import { User } from '@core/interfaces/api/user.interface'
import { RoleService } from '@core/services/api/role.service'
import { UserService } from '@core/services/api/user.service'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { take } from 'rxjs'

@Component({
  selector: 'create-edit-user',
  standalone: false,
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss',
})
export class CreateEditUserComponent {
  public userForm!: FormGroup
  public fb = inject(FormBuilder)
  roles: Role[] = []

  private _bsModalService = inject(BootstrapModalService)
  public modal = inject(NgbActiveModal)
  private roleService = inject(RoleService)
  private userService = inject(UserService)

  ngOnInit(): void {
    this.initForm()
    this.loadRoles()
    this.loadSelectedUser()
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      id: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
      isActive: [true],
    })
  }

  private updateForm(user: User): void {
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.role?.id,
      isActive: user.isActive,
    })
  }

  private loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data.result || []
      },
      error: () => {},
    })
  }

  private loadSelectedUser(): void {
    this._bsModalService
      .getDataIssued()
      .pipe(take(1))
      .subscribe({
        next: (data: { selectedRow: User }) => {
          if (data?.selectedRow) {
            this.updateForm(data.selectedRow)
          }
        },
        error: () => {},
      })
  }

  public saveChanges(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched()
      return
    }
    const updatedUser = { ...this.userForm.getRawValue() }
    const userId = updatedUser.id
    delete updatedUser.id

    if (!this.userForm.get('username')?.dirty) {
      delete updatedUser.username
    }
    if (!this.userForm.get('email')?.dirty) {
      delete updatedUser.email
    }

    this.userService.updateUser(userId, updatedUser).subscribe({
      next: (response) => {
        this.modal.close(response)
      },
      error: () => {},
    })
  }

  public handleClose(): void {
    this._bsModalService.closeModal()
  }
}
