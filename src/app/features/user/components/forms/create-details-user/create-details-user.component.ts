import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { User } from '@core/interfaces/api/user.interface'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
import { take } from 'rxjs'

@Component({
  selector: 'app-create-details-user',
  standalone: false,
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
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      isActive: [{ value: '', disabled: true }],
      createdAt: [{ value: '', disabled: true }],
    })
  }

  private updateForm(user: User): void {
    this.userDetailsForm.patchValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role?.displayName,
      isActive: user.isActive,
      createdAt: user.createdAt,
    })
  }

  handleClose(): void {
    this._bsModalService.closeModal()
  }
}
