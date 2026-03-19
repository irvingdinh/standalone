import { Injectable } from '@nestjs/common';

import { AdminEntity } from '../../core/entities/admin.entity';

@Injectable()
export class RolesService {
  computeScopes(admin: AdminEntity): string[] {
    return admin.role?.scopes?.map((s) => s.scope) ?? [];
  }
}
