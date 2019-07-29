import { Router } from 'express';
import { Route } from './Route';
import { Fakes } from '../../../tests/Fakes';

export const FakeRoute = (props: Route): Route => ({
  router: Router(),
  path: Fakes.string(),
  ...props
});
