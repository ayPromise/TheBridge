import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Book } from 'types/Book'

interface BooksState {
  value: Book[]
}

const initialState: BooksState = {
  value: []
}

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks:(state, action:PayloadAction<Book[]>)=>{
        state.value = action.payload
    },

    clearBooks:(state)=>{
        state.value = []
    }
  }
})


export const { setBooks, clearBooks } = booksSlice.actions

export default booksSlice.reducer