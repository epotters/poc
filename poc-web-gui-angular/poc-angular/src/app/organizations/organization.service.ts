import {Injectable} from '@angular/core';

import {EntityService} from 'entity-lib';
import {Organization} from '../core/domain';
import {PocApiService} from '../core/service';
import {organizationMeta} from './organization-meta';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends EntityService<Organization> {

  constructor(
    public apiService: PocApiService) {
    super(organizationMeta, apiService);
  }
}
