import React, { createContext, useContext, useState } from 'react';

type ItemCreationState = {
  itemName: string;
  description: string;
  pickupCity: string;
  deliveryCity: string;
  photos: string[];
  category: string;
  price: string;
  currency: string;
};

type ItemCreationContextType = {
  state: ItemCreationState;
  updateState: (updates: Partial<ItemCreationState>) => void;
  resetState: () => void;
};

const initialState: ItemCreationState = {
  itemName: '',
  description: '',
  pickupCity: '',
  deliveryCity: '',
  photos: [],
  category: '',
  price: '',
  currency: 'USD',
};

const ItemCreationContext = createContext<ItemCreationContextType | undefined>(undefined);

export function ItemCreationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ItemCreationState>(initialState);

  const updateState = (updates: Partial<ItemCreationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <ItemCreationContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </ItemCreationContext.Provider>
  );
}

export function useItemCreation() {
  const context = useContext(ItemCreationContext);
  if (context === undefined) {
    throw new Error('useItemCreation must be used within an ItemCreationProvider');
  }
  return context;
} 