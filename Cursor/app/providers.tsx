'use client';

import { createContext, useContext, useMemo, useReducer } from 'react';
import type { OfferFilter, OfferSort, SearchFilters } from '../lib/types';

type Status = 'idle' | 'loading' | 'error' | 'empty' | 'ready';

type AppState = {
  query: string;
  selectedProductId: string | null;
  selectedOfferId: string | null;
  selectedMerchantId: string | null;
  filters: SearchFilters;
  status: Status;
  errorMessage: string | null;
};

type Action =
  | { type: 'setQuery'; query: string }
  | { type: 'selectProduct'; productId: string | null }
  | { type: 'selectOffer'; offerId: string | null }
  | { type: 'selectMerchant'; merchantId: string | null }
  | { type: 'setFilters'; filters: Partial<SearchFilters> }
  | { type: 'setStatus'; status: Status; errorMessage?: string | null };

const defaultState: AppState = {
  query: '',
  selectedProductId: null,
  selectedOfferId: null,
  selectedMerchantId: null,
  filters: {
    sortBy: 'Lowest total cost',
    filter: 'All',
    country: 'All countries',
  },
  status: 'idle',
  errorMessage: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setQuery':
      return { ...state, query: action.query };
    case 'selectProduct':
      return { ...state, selectedProductId: action.productId };
    case 'selectOffer':
      return { ...state, selectedOfferId: action.offerId };
    case 'selectMerchant':
      return { ...state, selectedMerchantId: action.merchantId };
    case 'setFilters':
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case 'setStatus':
      return { ...state, status: action.status, errorMessage: action.errorMessage ?? null };
    default:
      return state;
  }
}

type AppStore = {
  state: AppState;
  setQuery: (query: string) => void;
  selectProduct: (productId: string | null) => void;
  selectOffer: (offerId: string | null) => void;
  selectMerchant: (merchantId: string | null) => void;
  setFilters: (filters: Partial<{ sortBy: OfferSort; filter: OfferFilter; country: string }>) => void;
  setStatus: (status: Status, errorMessage?: string | null) => void;
};

const AppStoreContext = createContext<AppStore | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const value = useMemo<AppStore>(
    () => ({
      state,
      setQuery: (query) => dispatch({ type: 'setQuery', query }),
      selectProduct: (productId) => dispatch({ type: 'selectProduct', productId }),
      selectOffer: (offerId) => dispatch({ type: 'selectOffer', offerId }),
      selectMerchant: (merchantId) => dispatch({ type: 'selectMerchant', merchantId }),
      setFilters: (filters) => dispatch({ type: 'setFilters', filters }),
      setStatus: (status, errorMessage) => dispatch({ type: 'setStatus', status, errorMessage }),
    }),
    [state]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProviders');
  return ctx;
}

