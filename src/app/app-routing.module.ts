import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodolistsComponent } from './todolists/todolists.component';
import { SearchComponent } from './search/search.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { ListComponent } from './list/list.component';
import { AddlistComponent } from './addlist/addlist.component';
import { AddToListDialogComponent } from './add-to-list/add-to-list.component';
import { ListContainerComponent } from './list-container/list-container.component';
import { TvDetailComponent } from './tv-detail/tv-detail.component';
import { ItemType } from './search.service';
import { DeleteListComponent } from './delete-list/delete-list.component';

const routes: Routes = [
  {
    path: 'mylists',
    component: TodolistsComponent,
    children: [
      {
        path: 'list/:name',
        component: ListContainerComponent,
        children: [
          {
            path: ':type/:visibility',
            component: ListComponent
          },
          {
            path: '',
            redirectTo: 'movies/all',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'addlist',
        component: AddlistComponent
      },
      {
        path: 'deletelist/:name',
        component: DeleteListComponent
      }
    ]
  },
  {
    path: 'search',
    redirectTo: 'search/'
  },
  {
    path: 'search/:searchterm',
    component: SearchComponent
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent,
    children: [
      {
        path: 'addtolist',
        component: AddToListDialogComponent,
        data: {
          type: ItemType.MOVIE
        }
      }
    ]
  },
  {
    path: 'tv/:id',
    component: TvDetailComponent,
    children: [
      {
        path: 'addtolist',
        component: AddToListDialogComponent,
        data: {
          type: ItemType.TV
        }
      }
    ]
  },
  {
    path: '',
    redirectTo: 'mylists',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
