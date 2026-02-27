import { Component } from '@angular/core'
import { brandListData } from '@core/helpers/global/second-dashboard.constants'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'brand-list',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './brand-list.component.html',
  styles: ``,
})
export class BrandListComponent {
  bransData = brandListData
}
