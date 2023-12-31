import type { RootState } from '@/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface SampleState {
  value: number;
}

// Define the initial state using that type
const initialState: SampleState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'sample',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.sample.value;

export default counterSlice.reducer;
