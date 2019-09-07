import { Urls } from './Urls';
import { Fakes } from '../../tests/Fakes';

export const FakeUrls = (props?: Urls): Urls => ({
  local: Fakes.string(),
  production: Fakes.string(),
  ...props
});
