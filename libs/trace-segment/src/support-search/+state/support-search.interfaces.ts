export interface LastSearch {
  // define state here
    idSupport: string;
    numSeg: string;
    error: boolean;
}

export interface LastSearchState {
  readonly lastSearch: LastSearch;
}
