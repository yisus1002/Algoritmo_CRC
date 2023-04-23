import { MathjaxPipe } from './latex';

describe('MathjaxPipe', () => {
  it('create an instance', () => {
    const pipe = new MathjaxPipe();
    expect(pipe).toBeTruthy();
  });
});
