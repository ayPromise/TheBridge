import { configureStore } from '@reduxjs/toolkit'
import booksReducer from 'features/books/booksSlice'
import chaptersReducer from 'features/chapters/chapterSlice'


export const store = configureStore({
  reducer: {
    books:booksReducer,
    chapters:chaptersReducer
  }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;