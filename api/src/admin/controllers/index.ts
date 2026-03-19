import { authControllers } from './auth';
import { profileControllers } from './profile';

export const controllers = [...authControllers, ...profileControllers];
