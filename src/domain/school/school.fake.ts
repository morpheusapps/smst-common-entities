import { School } from '.';
import { Fakes } from '../../../tests-utils/Fakes';

export const FakeSchool = (props?: Partial<School>): School => ({
  id: Fakes.uuid(),
  name: Fakes.string(),
  students: [],
  ...props
});
