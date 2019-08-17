import { Student } from '.';
import { FakeSchool } from '../school';
import { FakeUser } from '../user';
import { Fakes } from '../../../tests/Fakes';

export const FakeStudent = (props?: Partial<Student>): Student => ({
  id: Fakes.uuid(),
  email: Fakes.string(),
  school: FakeSchool(),
  user: FakeUser(),
  ...props
});
