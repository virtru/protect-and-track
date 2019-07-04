import { renderHook, act } from '@testing-library/react-hooks';
import useIsPortrait from '../useIsPortrait';

describe('my beverage', () => {
  let matches = false;
  const addListener = jest.fn();
  const removeListener = jest.fn();

  beforeAll(() => {
    throw 'awfw';
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches,
        addListener,
        removeListener,
      };
    });
  });

  test('should set mediaIsMatched on event lister trigger', () => {
    // const { result } = renderHook(() => useIsPortrait());
    // expect(addListener).toHaveBeenCalled();
    // expect(removeListener).toHaveBeenCalled();
    // // expect(addListener).toHaveBeenLastCalledWith();
    // // expect(removeListener).toHaveBeenLastCalledWith();
  });

  afterAll(() => {
    delete window.matchMedia;
  });
});
