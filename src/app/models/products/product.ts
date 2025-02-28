import {AbstractEntity} from '../abstract-entity';

export interface Product extends AbstractEntity {
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;
}
