import { configureStore } from '@reduxjs/toolkit'
import phonebookReducer from '@/redux/phonebookSlice'

export const store = configureStore({
    reducer: {
        phonebook: phonebookReducer
    }
})