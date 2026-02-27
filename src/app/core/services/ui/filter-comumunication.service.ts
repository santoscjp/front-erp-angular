import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FilterCommunicationService {
  private filterSource = new BehaviorSubject<any>(null)
  currentFilter = this.filterSource.asObservable()

  changeFilter(filter: any) {
    this.filterSource.next(filter)
  }

  getCurrentFilter(): any {
    return this.filterSource.value
  }

  resetFilter() {
    this.filterSource.next({})
  }
}
