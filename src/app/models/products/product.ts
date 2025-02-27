import {AbstractEntity} from '../abstract-entity';

export interface Product extends AbstractEntity {
  name: string;
  description: string;
  logo: string;
  dateRelease: Date;
  dateRevision: Date;
}
