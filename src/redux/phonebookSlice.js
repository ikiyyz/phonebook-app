import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { read, create, update, remove } from '@/api/phonebookApi';

const initialState = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    search: '',
    sortAsc: true,
    currentPhonebook: null,
    status: 'idle',
    pagination: {
        page: 1,
        limit: 10,
        pages: 0,
        total: 0
    }
}

// Async thunks
export const getPhonebooks = createAsyncThunk(
    'phonebook/getPhonebooks',
    async ({ page = 1, search = '', sortAsc = true, append = false }) => {
        const sort = sortAsc ? 'asc' : 'desc';
        const response = await read({
            page,
            limit: 10,
            keyword: search,
            sortBy: 'name',
            sortMode: sort
        });
        return { data: response.data, append };
    }
);

export const fetchPhonebookByIdAsync = createAsyncThunk(
    'phonebook/fetchPhonebookById',
    async (id) => {
        const response = await read({ id });
        return response.data;
    }
);

export const createPhonebookAsync = createAsyncThunk(
    'phonebook/createPhonebook',
    async (phonebookData) => {
        const response = await create(phonebookData);
        return response.data;
    }
);

export const updatePhonebookAsync = createAsyncThunk(
    'phonebook/updatePhonebook',
    async ({ id, ...phonebookData }) => {
        const response = await update(id, phonebookData);
        return response.data;
    }
);

export const deletePhonebookAsync = createAsyncThunk(
    'phonebook/deletePhonebook',
    async (id) => {
        await remove(id);
        return id;
    }
);

const phonebookSlice = createSlice({
    name: 'phonebook',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearCurrentPhonebook: (state) => {
            state.currentPhonebook = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPhonebooks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPhonebooks.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.append) {
                    state.items = [...state.items, ...action.payload.data.phonebooks];
                } else {
                    state.items = action.payload.data.phonebooks;
                }
                state.page = action.payload.data.page;
                state.pages = action.payload.data.pages;
            })
            .addCase(getPhonebooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch single phonebook
            .addCase(fetchPhonebookByIdAsync.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchPhonebookByIdAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.currentPhonebook = action.payload
            })
            .addCase(fetchPhonebookByIdAsync.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Create phonebook
            .addCase(createPhonebookAsync.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(createPhonebookAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.phonebooks.unshift(action.payload)
                state.pagination.total += 1
            })
            .addCase(createPhonebookAsync.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Update phonebook
            .addCase(updatePhonebookAsync.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(updatePhonebookAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                const index = state.phonebooks.findIndex(p => p.id === action.payload.id)
                if (index !== -1) {
                    state.phonebooks[index] = action.payload
                }
                if (state.currentPhonebook && state.currentPhonebook.id === action.payload.id) {
                    state.currentPhonebook = action.payload
                }
            })
            .addCase(updatePhonebookAsync.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Delete phonebook
            .addCase(deletePhonebookAsync.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(deletePhonebookAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.phonebooks = state.phonebooks.filter(p => p.id !== action.payload)
                state.pagination.total -= 1
                if (state.currentPhonebook && state.currentPhonebook.id === action.payload) {
                    state.currentPhonebook = null
                }
            })
            .addCase(deletePhonebookAsync.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const { clearError, clearCurrentPhonebook } = phonebookSlice.actions

// Selectors
export const selectPhonebooks = (state) => state.phonebook.phonebooks
export const selectCurrentPhonebook = (state) => state.phonebook.currentPhonebook
export const selectPhonebookStatus = (state) => state.phonebook.status
export const selectPhonebookError = (state) => state.phonebook.error
export const selectPhonebookPagination = (state) => state.phonebook.pagination

export default phonebookSlice.reducer 