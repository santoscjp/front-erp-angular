import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { User } from '@core/interfaces/api/user.interface'
import { CommonModule } from '@angular/common'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
import { take } from 'rxjs'
import { TranslatePipe } from '@ngx-translate/core'

@Component({
  selector: 'app-create-details-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './create-details-user.component.html',
  styleUrls: ['./create-details-user.component.scss'],
})
export class CreateDetailsUserComponent implements OnInit {
  public selectedRow!: User
  userDetailsForm!: FormGroup
  public fb = inject(FormBuilder)

  private _bsModalService = inject(BootstrapModalService<any>)

  ngOnInit(): void {
    this.initForm()

    this._bsModalService
      .getDataIssued()
      .pipe(take(1))
      .subscribe({
        next: (data: { selectedRow: User }) => {
          if (data?.selectedRow) {
            this.updateForm(data.selectedRow)
          }
        },
        error: (err) => {},
      })
  }
  private initForm(): void {
    this.userDetailsForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      roleId: [{ value: '', disabled: true }],
      companyId: [{ value: '', disabled: true }],
      isLocked: [{ value: '', disabled: true }],
      createdAt: [{ value: '', disabled: true }],
    })
  }

  private updateForm(user: User): void {
    this.userDetailsForm.patchValue({
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      roleId: user.roleId?.roleName,
      companyId: user.companyId?.companyName,
      isLocked: user.isLocked,
      createdAt: user.createdAt,
    })
  }

  handleClose(): void {
    this._bsModalService.closeModal()
  }
}
