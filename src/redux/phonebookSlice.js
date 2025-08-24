import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { read, create, update, remove } from '@/api/phonebookApi'

const initialState = {
  items: [],
  error: null,
  status: 'idle',
  page: 1,
  pages: 1,
  total: 0,
};

// ===== Get Phonebooks with Pagination =====
export const getPhonebooksAsync = createAsyncThunk(
  'phonebook/getPhonebooks',
  async ({ page = 1, keyword = '', sortAsc = true, append = false } = {}) => {
    const params = {
      page,
      keyword: keyword.trim(), // ✅ sesuai backend
      sortBy: 'name',
      sortMode: sortAsc ? 'asc' : 'desc'
    };

    const res = await read(params);

    return {
      phonebooks: res.data?.data || [], // ✅ ambil dari "data"
      page: res.data?.pagination?.page || 1,
      pages: res.data?.pagination?.pages || 1,
      total: res.data?.pagination?.total || 0,
      append
    };
  }
);

// ===== Create Phonebook =====
export const createPhonebookAsync = createAsyncThunk(
  'phonebook/createPhonebook',
  async (payload) => {
    const res = await create(payload);
    return res.data.data;
  }
);
// ===== Update Phonebook =====
export const updatePhonebookAsync = createAsyncThunk(
  'phonebook/updatePhonebook',
  async ({ id, ...payload }) => {
    const res = await update(id, payload);
    return res.data.data;
  }
);

// ===== Delete Phonebook =====
export const deletePhonebookAsync = createAsyncThunk(
  'phonebook/deletePhonebook',
  async (id) => {
    const res = await remove(id);
    return res.data.data;
  }
);

export const phonebookSlice = createSlice({
  name: 'phonebook',
  initialState,
  reducers: {
    add: (state, action) => {
      state.items = [action.payload, ...state.items];
    }
  },
  extraReducers: (builder) => {
    builder
      // ===== Get Phonebooks =====
      .addCase(getPhonebooksAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPhonebooksAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const { phonebooks, page, pages, total, append } = action.payload;

        if (append) {
          state.items = [...state.items, ...phonebooks];
        } else {
          
          state.items = phonebooks || [];
        }

        state.page = page;
        state.pages = pages;
        state.total = total;
      })
      .addCase(getPhonebooksAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load phonebooks';
      })

      // ===== Create =====
      .addCase(createPhonebookAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // ===== Update =====
      .addCase(updatePhonebookAsync.fulfilled, (state, action) => {
        const idx = state.items.findIndex(pb => pb.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload };
        }
      })

      // ===== Delete =====
      .addCase(deletePhonebookAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(pb => pb.id !== action.payload.id);
      });
  }
});

export const { add } = phonebookSlice.actions;
export const getPhonebooks = (state) => state.phonebook.items;
export default phonebookSlice.reducer;
