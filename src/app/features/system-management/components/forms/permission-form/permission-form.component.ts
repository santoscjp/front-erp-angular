import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
import { TranslatePipe } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'permission-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './permission-form.component.html',
})
export class PermissionFormComponent implements OnInit, OnDestroy {
  permissionForm!: UntypedFormGroup
  public isEditMode: boolean = false
  public moduleName: string = ''
  private modalData!: Subscription
  public isLoading: boolean = false
  public isLoadingButton: boolean = false

  private formBuilder = inject(UntypedFormBuilder)
  private _bsModalService = inject(BootstrapModalService)

  ngOnInit(): void {
    this.getConfigForm()
    this.getPermissionData()
  }

  getConfigForm() {
    this.permissionForm = this.formBuilder.group({
      permissionName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  getPermissionData() {
    this.modalData = this._bsModalService
      .getDataIssued()
      .subscribe((data) => {
        if (data?.permissionId) {
          this.isEditMode = true
        }
      })
  }

  onSubmit() {
    if (this.permissionForm.valid) {
      this.closeModal()
    }
  }

  public closeModal(): void {
    this._bsModalService.closeModal()
  }

  ngOnDestroy(): void {
    this.modalData.unsubscribe()
  }
}
