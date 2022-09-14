import { UseCase } from '../src';

const testFunction: UseCase<{ id: string }, { auth: { id: string }}, boolean> = ({ id }, { auth: { id: auth_id }}) => {
  return id == auth_id
}

describe('use case function', () => {
  it('should allow type checking to work', () => {
    expect(testFunction({ id: '1' } , { auth: { id: '1' }})).toEqual(true);
  });
});
