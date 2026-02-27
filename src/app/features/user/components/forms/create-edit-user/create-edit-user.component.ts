import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Company } from '@core/interfaces/api/company.interface'
import { Role } from '@core/interfaces/api/rol.interface'
import { User } from '@core/interfaces/api/user.interface'
import { CompanyService } from '@core/services/api/company.service'
import { RoleService } from '@core/services/api/role.service'
import { UserService } from '@core/services/api/user.service'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslatePipe } from '@ngx-translate/core'
import { take } from 'rxjs'

@Component({
  selector: 'create-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, TranslatePipe],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss',
})
export class CreateEditUserComponent {
  public userForm!: FormGroup
  public fb = inject(FormBuilder)
  roles: Role[] = []
  companies: Company[] = []

  private _bsModalService = inject(BootstrapModalService)
  public modal = inject(NgbActiveModal)
  private roleService = inject(RoleService)
  private companyService = inject(CompanyService)
  private userService = inject(UserService)

  ngOnInit(): void {
    this.initForm()
    this.loadCompanies()
    this.loadRoles()
    this.loadSelectedUser()
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      _id: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      phone: [''],
      roleId: ['', Validators.required],
      companyId: ['', Validators.required],
      isLocked: [false],
    })
  }

  private updateForm(user: User): void {
    this.userForm.patchValue({
      _id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      roleId: user.roleId._id,
      companyId: user.companyId._id,
      isLocked: user.isLocked,
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

  private loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (response) => {
        this.companies = response.data.result
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
    const userId = updatedUser._id
    delete updatedUser._id

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
