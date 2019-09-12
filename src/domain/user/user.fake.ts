import { User } from '.';
import { Fakes } from '../../../tests-utils/Fakes';

export const FakeUser = (props?: Partial<User>): User => ({
  id: Fakes.uuid(),
  primaryEmail: Fakes.string(),
  name: Fakes.string(),
  students: [],
  ...props
});
