import {Injectable} from '@angular/core';

import {EntityService} from 'entity-lib';
import {NGXLogger} from 'ngx-logger';
import {Organization} from '../core/domain';
import {PocApiService} from '../core/service';
import {organizationMeta} from './organization-meta';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends EntityService<Organization> {

  constructor(
    public apiService: PocApiService,
    public logger: NGXLogger) {
    super(organizationMeta, apiService, logger);
  }
}
