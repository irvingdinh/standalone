import { IndexController } from './index.controller';
import { RolesController } from './roles.controller';
import { ShowController } from './show.controller';
import { StoreController } from './store.controller';
import { UpdateController } from './update.controller';

export const adminsControllers = [
  RolesController,
  IndexController,
  StoreController,
  ShowController,
  UpdateController,
];
