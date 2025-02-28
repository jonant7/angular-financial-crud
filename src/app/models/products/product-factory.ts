import { Product } from './product';
import {ProductPost} from './product-post';

export const createProduct = (overrides?: Partial<Product>): Product => ({
  id: 'id-1',
  name: 'Default Product',
  description: 'Default Description',
  logo: 'default-logo.jpg',
  dateRelease: new Date(),
  dateRevision: new Date(),
  ...overrides,
});

export const createProductPost = (overrides?: Partial<ProductPost>): ProductPost => ({
  id: 'id-1',
  name: 'Default Product',
  description: 'Default Description',
  logo: 'default-logo.jpg',
  date_release: new Date(),
  date_revision: new Date(),
  ...overrides,
});

export const createMockProducts = (count: number = 2): Product[] => {
  return Array.from({ length: count }, (_, index) => createProduct({ id: `id-${index + 1}`, name: `Product ${index + 1}` }));
};
