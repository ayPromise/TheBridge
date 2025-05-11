import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IChapter } from 'types/Chapter'

interface ChaptersState {
  value: IChapter[]
}

const initialState: ChaptersState = {
  value: []
}

export const chaptersSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    setChapters:(state, action:PayloadAction<IChapter[]>)=>{
        state.value = action.payload
    },

    clearChapters:(state)=>{
        state.value = []
    }
  }
})


export const { setChapters, clearChapters } = chaptersSlice.actions

export default chaptersSlice.reducer