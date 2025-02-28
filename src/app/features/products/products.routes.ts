import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import(  './product-list/product-list.component')
      .then(c => c.ProductListComponent),
    pathMatch: "full"
  },
  {
    path: 'create',
    loadComponent: () => import(  './product-edition/product-edition.component')
      .then(c => c.ProductEditionComponent),
    pathMatch: "full"
  },
  {
    path: 'edit/:id',
    loadComponent: () => import(  './product-edition/product-edition.component')
      .then(c => c.ProductEditionComponent),
    pathMatch: "full"
  }
];
