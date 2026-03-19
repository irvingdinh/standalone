import { AdminGuard } from './admin.guard';
import { ScopeGuard } from './scope.guard';

export const guards = [AdminGuard, ScopeGuard];
