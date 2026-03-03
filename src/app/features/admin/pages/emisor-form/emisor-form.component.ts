import { Component, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { RoleService } from '@core/services/api/role.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { ModuleKey } from '@/app/shared/enums/module-key.enum'
import { MODULE_LABELS } from '@/app/shared/constants/modules.constants'
import { EmisorCreateRequest } from '@core/interfaces/api/company.interface'
import { Role } from '@core/interfaces/api/rol.interface'
import { rucValidator } from '@/app/shared/validators/ruc.validator'
import { generateSecurePassword } from '@/app/shared/utils/password.utils'

@Component({
  selector: 'app-emisor-form',
  standalone: false,
  templateUrl: './emisor-form.component.html',
  styleUrls: ['./emisor-form.component.scss'],
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
  showAdminPassword = false

  private readonly stepFields: Record<number, string[]> = {
    1: ['adminUsername', 'adminEmail', 'adminPassword', 'adminFirstName', 'adminLastName', 'adminRoleId'],
    2: ['ruc', 'businessName', 'mainAddress', 'accountingObligation'],
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
      businessName: ['', [Validators.required]],
      tradeName: [''],
      mainAddress: ['', [Validators.required]],
      accountingObligation: ['SI', [Validators.required]],
      specialTaxpayerCode: [''],
      retentionAgent: [false],
      microenterpriseRegime: [false],
      rimpeRegime: [false],
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

  togglePasswordVisibility(): void {
    this.showAdminPassword = !this.showAdminPassword
  }

  generatePassword(): void {
    this.emisorForm.patchValue({ adminPassword: generateSecurePassword() })
    this.showAdminPassword = true
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
    this.adminService.createEmisor(this.buildEmisorRequest()).subscribe({
      next: (response) => {
        this.isSubmitting = false
        if (response.message?.includes('Advertencia:')) {
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.SYNC_WARNING_TITLE',
            message: response.message,
            type: 'warning',
          })
        }
        this.router.navigate(['/admin/issuers', response.data.id])
      },
      error: () => {
        this.isSubmitting = false
      },
    })
  }

  private buildEmisorRequest(): EmisorCreateRequest {
    const v = this.emisorForm.value
    return {
      ruc: v.ruc,
      businessName: v.businessName,
      tradeName: v.tradeName || undefined,
      mainAddress: v.mainAddress,
      accountingObligation: v.accountingObligation,
      specialTaxpayerCode: v.specialTaxpayerCode || undefined,
      retentionAgent: v.retentionAgent,
      microenterpriseRegime: v.microenterpriseRegime,
      rimpeRegime: v.rimpeRegime,
      modules: v.modules,
      adminUser: {
        username: v.adminUsername,
        email: v.adminEmail,
        firstName: v.adminFirstName,
        lastName: v.adminLastName,
        password: v.adminPassword,
        roleId: v.adminRoleId,
      },
    }
  }
}
