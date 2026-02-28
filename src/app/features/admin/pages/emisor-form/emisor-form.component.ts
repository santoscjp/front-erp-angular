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
import { NgSelectModule } from '@ng-select/ng-select'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { RoleService } from '@core/services/api/role.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { ModuleKey } from '@/app/shared/enums/module-key.enum'
import { MODULE_LABELS } from '@/app/shared/constants/modules.constants'
import { EmisorCreateRequest } from '@core/interfaces/api/company.interface'
import { Role } from '@core/interfaces/api/rol.interface'
import { rucValidator } from '@/app/shared/validators/ruc.validator'

@Component({
  selector: 'app-emisor-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule, NgSelectModule],
  templateUrl: './emisor-form.component.html',
  styleUrls: ['./emisor-form.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmisorFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private adminService = inject(AdminEmisorService)
  private roleService = inject(RoleService)
  private notificationService = inject(ToastrNotificationService)
  private translate = inject(TranslateService)

  emisorForm!: FormGroup
  isSubmitting = false
  moduleKeys = Object.values(ModuleKey)
  moduleLabels = MODULE_LABELS
  roles: Role[] = []

  currentStep = 1
  readonly TOTAL_STEPS = 3

  private readonly stepFields: Record<number, string[]> = {
    1: ['adminUsername', 'adminEmail', 'adminPassword', 'adminFirstName', 'adminLastName', 'adminRoleId'],
    2: ['ruc', 'razonSocial', 'direccionMatriz', 'obligadoContabilidad'],
    3: [],
  }

  ngOnInit(): void {
    this.initForm()
    this.loadRoles()
  }

  private loadRoles(): void {
    this.roleService.getSelectableRoles().subscribe({
      next: (response) => {
        this.roles = response.data
      },
    })
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
      adminUsername: ['', [Validators.required, Validators.minLength(3)]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminFirstName: ['', [Validators.required]],
      adminLastName: ['', [Validators.required]],
      adminPassword: ['', [Validators.required, Validators.minLength(8)]],
      adminRoleId: [null, [Validators.required]],
    })
  }

  get f() {
    return this.emisorForm.controls
  }

  isStepValid(step: number): boolean {
    const fields = this.stepFields[step]
    if (!fields || fields.length === 0) return true
    return fields.every((field) => this.emisorForm.get(field)?.valid)
  }

  getProgressWidth(): string {
    if (this.currentStep <= 1) return '0%'
    return `${((this.currentStep - 1) / this.TOTAL_STEPS) * 100}%`
  }

  getStepStatus(step: number): string {
    if (step < this.currentStep) return 'completed'
    if (step === this.currentStep) return 'in_progress'
    return 'pending'
  }

  nextStep(): void {
    if (!this.isStepValid(this.currentStep)) {
      this.markStepFieldsTouched(this.currentStep)
      this.notificationService.showNotification({
        type: 'error',
        title: 'Error',
        message: this.translate.instant('USER.ERRORS.ERROR_REQUIRED_FIELDS'),
      })
      return
    }
    if (this.currentStep < this.TOTAL_STEPS) {
      this.currentStep++
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  goToStep(step: number): void {
    if (step < 1 || step > this.TOTAL_STEPS) return
    if (step <= this.currentStep) {
      this.currentStep = step
      return
    }
    for (let i = 1; i < step; i++) {
      if (!this.isStepValid(i)) return
    }
    this.currentStep = step
  }

  private markStepFieldsTouched(step: number): void {
    const fields = this.stepFields[step]
    fields.forEach((field) => this.emisorForm.get(field)?.markAsTouched())
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
        username: formValue.adminUsername,
        email: formValue.adminEmail,
        firstName: formValue.adminFirstName,
        lastName: formValue.adminLastName,
        password: formValue.adminPassword,
        roleId: formValue.adminRoleId,
      },
    }

    this.adminService.createEmisor(request).subscribe({
      next: (response) => {
        this.isSubmitting = false
        if (response.message?.includes('Advertencia:')) {
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.SYNC_WARNING_TITLE',
            message: response.message,
            type: 'warning',
          })
        }
        this.router.navigate(['/admin/emisores', response.data.id])
      },
      error: () => {
        this.isSubmitting = false
      },
    })
  }
}
