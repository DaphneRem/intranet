import { lastSearchReducer } from './support-search.reducer';
import { lastSearchInitialState } from './support-search.init';
import { LastSearch } from './support-search.interfaces';
import { LastSearchAction } from './support-search.actions';

describe('lastSearchReducer', () => {

  it('should change lastSearch state with error = true', () => {
    const actual = lastSearchReducer(
      {
        idSupport: '',
        numSeg: '',
        error: false
      },
      {
        type: 'ERROR_SEARCH',
         payload:
         {
           idSupport: '',
            numSeg: ''
          }
      });
    const expected = {
            idSupport: '',
            numSeg: '',
            error: true
            };
    expect(actual).toEqual(expected);
  });

  it('should change lastSearch state with error = false', () => {
    const actual = lastSearchReducer(
      {
        idSupport: '',
        numSeg: '',
        error: true
      },
      {
        type: 'NO_ERROR_SEARCH',
         payload:
         {
           idSupport: '',
            numSeg: ''
          }
      });
    const expected = {
            idSupport: '',
            numSeg: '',
            error: false
            };
    expect(actual).toEqual(expected);
  });

});
