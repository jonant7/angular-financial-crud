import {AbstractEntity} from '../abstract-entity';

export interface ProductPut extends AbstractEntity {
  name: string;
  description: string;
  logo: string;
  dateRelease: Date;
  dateRevision: Date;
}
