import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IBook } from 'types/Book'

interface BooksState {
  value: IBook[]
}

const initialState: BooksState = {
  value: []
}

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks:(state, action:PayloadAction<IBook[]>)=>{
        state.value = action.payload
    },

    clearBooks:(state)=>{
        state.value = []
    }
  }
})


export const { setBooks, clearBooks } = booksSlice.actions

export default booksSlice.reducer