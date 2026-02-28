import { Component, inject, Renderer2, OnDestroy, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { LogoComponent } from '../logo/logo.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LogoComponent,
    TranslateModule,
  ],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  private renderer = inject(Renderer2)

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'h-100')
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'h-100')
  }
}
