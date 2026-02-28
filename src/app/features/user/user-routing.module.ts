import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UserComponent } from './pages/user.component'

const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    data: { title: 'USER.TITLE' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
