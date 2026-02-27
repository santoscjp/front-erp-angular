import { Component } from '@angular/core'
import { productData } from '@core/helpers/global/second-dashboard.constants'
import { RouterLink } from '@angular/router'
import { DatePipe } from '@angular/common'
import { currency } from '@core/helpers/ui/constants'

@Component({
  selector: 'selling-products',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './selling-products.component.html',
  styles: ``,
})
export class SellingProductsComponent {
  sellingProducts = productData
  currency = currency
}
