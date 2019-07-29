import _ from 'lodash';
import { API } from './API';
import { Fakes } from '../../../tests/Fakes';

export const FakeAPI = (props: API): API => ({
  route: Fakes.string(),
  method: _.sample(['get', 'post', 'put', 'delete', 'patch']),
  action: jest.fn((): void => {}),
  ...props
});
