import health from './health';
import student from './student';
import { CombineRoutes } from './utils/CombineRoutes';

export const routes = CombineRoutes([health, student]);
