import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { TableFilter } from '@core/interfaces/ui/table-filter.interface'

@Injectable({
  providedIn: 'root',
})
export class FilterCommunicationService {
  private filterSource = new BehaviorSubject<TableFilter | null>(null)
  currentFilter = this.filterSource.asObservable()

  changeFilter(filter: TableFilter): void {
    this.filterSource.next(filter)
  }

  getCurrentFilter(): TableFilter | null {
    return this.filterSource.value
  }

  resetFilter(): void {
    this.filterSource.next({})
  }
}
