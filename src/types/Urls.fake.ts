import { Urls } from './Urls';
import { Fakes } from '../../tests-utils/Fakes';

export const FakeUrls = (props?: Urls): Urls => ({
  local: Fakes.string(),
  production: Fakes.string(),
  ...props
});
