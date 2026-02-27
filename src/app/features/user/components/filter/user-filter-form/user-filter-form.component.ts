import { FlatpickrDirective } from '@/app/shared/directives/flatpickr.directive'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BLOCKED_OPTIONS } from '@core/helpers/global/global.constants'
import { NgSelect } from '@core/interfaces/ui/ui.interface'
import { FilterCommunicationService } from '@core/services/ui/filter-comumunication.service'
import { NgSelectModule } from '@ng-select/ng-select'
import { TranslatePipe } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { format } from 'date-fns'

@Component({
  selector: 'user-filter-form',
  standalone: true,
  imports: [
    TranslatePipe,
    NgSelectModule,
    CommonModule,
    ReactiveFormsModule,
    FlatpickrDirective,
  ],
  providers: [],
  templateUrl: './user-filter-form.component.html',
})
export class UserFilterFormComponent implements OnInit {
  public userFilterForm: FormGroup | undefined = undefined
  public currentDatePlaceholder: string = ''
  public endOfMonthPlaceholder: string = ''
  public defaultFromDate: string = ''
  public defaultToDate: string = ''

  private _formBuilder = inject(FormBuilder)
  private _filterCommunicationService = inject(FilterCommunicationService)

  public blocked$: Observable<NgSelect<boolean>[]> = of(BLOCKED_OPTIONS)

  ngOnInit(): void {
    this.setDefaultDates()
    this.userFilterForm = this.getConfigFilterForm()
  }

  private getConfigFilterForm(): FormGroup {
    return this._formBuilder.group({
      username: [''],
      email: [''],
      phone: [''],
      address: [''],
      isLocked: [null],
      fromDate: [this.defaultFromDate],
      toDate: [this.defaultToDate],
    })
  }

  private setDefaultDates(): void {
    const now = new Date()

    // Calcular la fecha actual con hora 00:00
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    )
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    )

    // Formatear las fechas como cadenas
    this.defaultFromDate = format(startOfDay, 'yyyy-MM-dd HH:mm')
    this.defaultToDate = format(endOfMonth, 'yyyy-MM-dd HH:mm')

    this.currentDatePlaceholder = this.defaultFromDate
    this.endOfMonthPlaceholder = this.defaultToDate
  }

  public onReset(): void {
    this.userFilterForm?.reset()
    this._filterCommunicationService.resetFilter()
  }

  public onSubmit(): void {
    if (!this.userFilterForm?.valid) return

    const filterValues = this.userFilterForm?.value

    if (!filterValues.fromDate) {
      filterValues.fromDate = this.defaultFromDate
    }
    if (!filterValues.toDate) {
      filterValues.toDate = this.defaultToDate
    }

    const cleanedFilter = Object.fromEntries(
      Object.entries(filterValues).filter(
        ([_, value]) => value !== null && value !== ''
      )
    )

    this._filterCommunicationService.changeFilter(cleanedFilter)
  }
}
