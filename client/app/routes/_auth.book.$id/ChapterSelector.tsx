import React from 'react'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { setChapters } from 'features/chapters/chapterSlice'

// types
import type { IBook } from 'types/Book'
import type { IChapter } from 'types/Chapter'
import type { AppDispatch, RootState } from 'store'

interface ChapterSelectorProps {
    book: IBook,
    setCurrentChapter: React.Dispatch<React.SetStateAction<IChapter>>
}

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ book, setCurrentChapter }) => {
    const dispatch = useDispatch<AppDispatch>()
    const chapters = useSelector((state: RootState) => state.chapters.value) as IChapter[]

    const handleClick = async (id: number) => {
        const chapterFromRedux = chapters.find((ch) => ch.id === id)
        if (chapterFromRedux) {
            setCurrentChapter(chapterFromRedux)
            return
        }
        const urlAPI = new URL(CLIENT_URL + `/api/books/${book.id}/chapters/${id}`)
        const response = await fetch(urlAPI)
        const newChapter = await response.json()

        if (newChapter)
            setCurrentChapter(newChapter)

        dispatch(setChapters([...chapters, newChapter]))
    }

    return (
        <div className="flex gap-4 mb-8 flex-wrap">
            {book.chapters.map((ch, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(ch.id)}
                    className="text-red-600 hover:underline font-medium"
                >
                    {ch.title}
                </button>
            ))}
        </div>
    )
}

export default ChapterSelector