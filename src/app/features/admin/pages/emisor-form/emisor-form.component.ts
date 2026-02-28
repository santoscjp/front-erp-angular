import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { ModuleKey } from '@/app/shared/enums/module-key.enum'
import { MODULE_LABELS } from '@/app/shared/constants/modules.constants'
import { EmisorCreateRequest } from '@core/interfaces/api/company.interface'
import { rucValidator } from '@/app/shared/validators/ruc.validator'

@Component({
  selector: 'app-emisor-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './emisor-form.component.html',
  styleUrls: ['./emisor-form.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmisorFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private adminService = inject(AdminEmisorService)
  private notificationService = inject(ToastrNotificationService)
  private translate = inject(TranslateService)

  emisorForm!: FormGroup
  isSubmitting = false
  moduleKeys = Object.values(ModuleKey)
  moduleLabels = MODULE_LABELS

  ngOnInit(): void {
    this.initForm()
  }

  private initForm(): void {
    this.emisorForm = this.fb.group({
      ruc: ['', [Validators.required, Validators.pattern(/^\d{13}$/), rucValidator]],
      razonSocial: ['', [Validators.required]],
      nombreComercial: [''],
      direccionMatriz: ['', [Validators.required]],
      obligadoContabilidad: ['SI', [Validators.required]],
      contribuyenteEspecial: [''],
      agenteRetencion: [false],
      regimenMicroempresa: [false],
      regimenRimpe: [false],
      modules: [[] as ModuleKey[]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminFirstName: ['', [Validators.required]],
      adminLastName: ['', [Validators.required]],
      adminPassword: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  get f() {
    return this.emisorForm.controls
  }

  onModuleToggle(moduleKey: ModuleKey, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked
    const current: ModuleKey[] = this.emisorForm.get('modules')?.value || []
    if (isChecked) {
      this.emisorForm.patchValue({ modules: [...current, moduleKey] })
    } else {
      this.emisorForm.patchValue({
        modules: current.filter((m) => m !== moduleKey),
      })
    }
  }

  isModuleSelected(moduleKey: ModuleKey): boolean {
    const modules: ModuleKey[] = this.emisorForm.get('modules')?.value || []
    return modules.includes(moduleKey)
  }

  onSubmit(): void {
    if (!this.emisorForm.valid) {
      this.emisorForm.markAllAsTouched()
      this.notificationService.showNotification({
        type: 'error',
        title: 'Error',
        message: this.translate.instant('USER.ERRORS.ERROR_REQUIRED_FIELDS'),
      })
      return
    }

    this.isSubmitting = true
    const formValue = this.emisorForm.value

    const request: EmisorCreateRequest = {
      ruc: formValue.ruc,
      razonSocial: formValue.razonSocial,
      nombreComercial: formValue.nombreComercial || undefined,
      direccionMatriz: formValue.direccionMatriz,
      obligadoContabilidad: formValue.obligadoContabilidad,
      contribuyenteEspecial: formValue.contribuyenteEspecial || undefined,
      agenteRetencion: formValue.agenteRetencion,
      regimenMicroempresa: formValue.regimenMicroempresa,
      regimenRimpe: formValue.regimenRimpe,
      modules: formValue.modules,
      adminUser: {
        email: formValue.adminEmail,
        firstName: formValue.adminFirstName,
        lastName: formValue.adminLastName,
        password: formValue.adminPassword,
      },
    }

    this.adminService.createEmisor(request).subscribe({
      next: (response) => {
        this.isSubmitting = false
        this.router.navigate(['/admin/emisores', response.data.id])
      },
      error: () => {
        this.isSubmitting = false
      },
    })
  }
}
