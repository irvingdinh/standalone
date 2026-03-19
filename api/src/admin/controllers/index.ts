import { adminsControllers } from './admins';
import { authControllers } from './auth';
import { profileControllers } from './profile';

export const controllers = [
  ...adminsControllers,
  ...authControllers,
  ...profileControllers,
];
