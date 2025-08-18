import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { read, create, update, remove } from '@/api/phonebookApi';

export const getPhonebooks = createAsyncThunk(
    'phonebook/getPhonebooks',
    async ({ keyword = '', sortAsc = true, append = false, page = 1, limit = 20 } = {}, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const currentPage = append ? state.phonebook.pagination.page + 1 : page;

            const params = {
                keyword: keyword.trim(),
                sortBy: 'name',
                sortMode: sortAsc ? 'asc' : 'desc',
                page: currentPage,
                limit
            };

            const response = await read(params);
            const data = response?.data?.data || [];
            const pagination = response?.data?.pagination || {
                page: currentPage,
                limit,
                total: data.length,
                pages: 1
            };

            return { data, append, pagination };
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to fetch contacts');
        }
    }
);

// Tambah kontak baru
export const createPhonebook = createAsyncThunk('phonebook/createPhonebook', async (data, { rejectWithValue }) => {
    try {
        const response = await create(data);
        return response.data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message);
    }
});

// Update kontak / partial update (bisa nama, phone, avatar, dll)
export const updatePhonebook = createAsyncThunk('phonebook/updatePhonebook', async ({ id, ...data }, { rejectWithValue }) => {
    try {
        const response = await update(id, data);
        return response.data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message);
    }
});

export const deletePhonebook = createAsyncThunk('phonebook/deletePhonebook', async (id, { rejectWithValue }) => {
    try {
        await remove(id);
        return id;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message);
    }
});

const phonebookSlice = createSlice({
    name: 'phonebook',
    initialState: {
        items: [],
        loading: false,
        error: null,
        pagination: { page: 1, limit: 20, total: 0, pages: 1, hasMore: false }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ===== Get Phonebooks =====
            .addCase(getPhonebooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPhonebooks.fulfilled, (state, action) => {
                state.loading = false;
                const { data = [], append, pagination } = action.payload;

                state.items = append
                    ? [...state.items, ...data.filter(item => !state.items.some(i => i.id === item.id))]
                    : data;

                state.pagination = {
                    ...pagination,
                    hasMore: pagination.page < pagination.pages
                };
            })
            .addCase(getPhonebooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===== Create Phonebook =====
            .addCase(createPhonebook.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            // Update Phonebook (termasuk update avatar)
            .addCase(updatePhonebook.fulfilled, (state, action) => {
                const idx = state.items.findIndex(i => i.id === action.payload.id);
                if (idx !== -1) {
                  state.items[idx] = {
                    ...state.items[idx],
                    ...action.payload,
                    avatar: action.payload.avatar ?? state.items[idx].avatar
                  };
                }
              })
            // ===== Delete Phonebook =====
            .addCase(deletePhonebook.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i.id !== action.payload);
            });
    }
});

export default phonebookSlice.reducer;
