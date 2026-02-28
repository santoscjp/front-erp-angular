import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JournalEntriesComponent } from './pages/journal-entries.component'

const routes: Routes = [
  {
    path: '',
    component: JournalEntriesComponent,
    data: { title: 'Journal Entries' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JournalEntriesRoutingModule {}
