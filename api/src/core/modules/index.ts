import { configModule } from './config.module.js';
import { eventEmitterModule } from './event-emitter.module.js';
import { typeormForRoot } from './typeorm.module.js';

export const modules = [configModule, eventEmitterModule, typeormForRoot];
