import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import(  './product-list/product-list.component')
      .then(c => c.ProductListComponent),
    pathMatch: "full"
  },
];
