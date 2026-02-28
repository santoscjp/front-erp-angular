import type { Route } from '@angular/router'
import { JournalEntriesComponent } from './pages/journal-entries.component'

export const JOURNAL_ENTRIES_ROUTES: Route[] = [
  {
    path: '',
    component: JournalEntriesComponent,
    data: { title: 'Journal Entries' },
  },
]
