export interface LastSearchError {
  type: 'ERROR_SEARCH';
  payload: {
    idSupport: string;
    numSeg: string;
  };
}

export interface LastSearchNoError {
  type: 'NO_ERROR_SEARCH';
  payload: {
    idSupport: string;
    numSeg: string;
  };
}


export type LastSearchAction = LastSearchError | LastSearchNoError;
