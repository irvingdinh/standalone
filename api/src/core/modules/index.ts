import { configModule } from './config.module.js';
import { DrizzleModule } from './drizzle.module.js';
import { eventEmitterModule } from './event-emitter.module.js';

export const modules = [configModule, eventEmitterModule, DrizzleModule];
