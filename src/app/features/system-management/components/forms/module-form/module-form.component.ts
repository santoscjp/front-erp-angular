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
  selector: 'module-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './module-form.component.html',
  styleUrl: './module-form.component.scss',
})
export class ModuleFormComponent implements OnInit, OnDestroy {
  moduleForm!: UntypedFormGroup
  isEditMode: boolean = false
  moduleId: number | null = null
  private modalData!: Subscription
  public isLoading: boolean = false
  public isLoadingButton: boolean = false

  private formBuilder = inject(UntypedFormBuilder)
  private _bsModalService = inject(BootstrapModalService)

  ngOnInit(): void {
    this.getConfigForm()
    this.getModuleData()
  }

  getConfigForm() {
    this.moduleForm = this.formBuilder.group({
      moduleName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  getModuleData() {
    this.modalData = this._bsModalService
      .getDataIssued()
      .subscribe((data) => {
        if (data?.moduleId) {
          this.moduleId = data.moduleId
          this.isEditMode = true
        }
      })
  }

  onSubmit() {
    if (this.moduleForm.valid) {
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
