import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  username: string;
  email: string;
  phone: string;
  id: number | null;
}

interface FilterState {
  name: string;
  username: string;
  email: string;
  phone: string;
  id: number | null;
}

interface TableState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: FilterState;
}

export const fetchUsers = createAsyncThunk('table/fetchUsers', async () => {
  const response = await fetch(import.meta.env.VITE_MOCK_API)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  const data: User[] = await response.json()
  return data
});

const initialState: TableState = {
  users: [],
  status: 'idle',
  error: null,
  filters: {
    name: '',
    username: '',
    email: '',
    phone: '',
    id: null,
  },
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ field: keyof FilterState; value: string | number | null }>) => {
      const { field, value } = action.payload;

      (state.filters[field] as string | number | null) = value
    },
    clearFilter: (state) => {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export const { setFilter, clearFilter } = tableSlice.actions
export default tableSlice.reducer
