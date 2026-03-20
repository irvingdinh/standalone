import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE, type DrizzleDB } from '../../core/modules/drizzle.module.js';

@Injectable()
export class AdminRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
}
