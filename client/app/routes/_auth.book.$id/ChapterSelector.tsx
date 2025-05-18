import React from 'react'

// types
import type { IBook } from 'types/Book'
import type { IChapter } from 'types/Chapter'

interface ChapterSelectorProps {
    book: IBook,
    currentChapter: IChapter,
    setCurrentChapter: React.Dispatch<React.SetStateAction<IChapter | null>>
}

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ book, setCurrentChapter, currentChapter }) => {
    const handleClick = async (id: number) => {

        const urlAPI = new URL(CLIENT_URL + `/api/books/${book.id}/chapters/${id}`)
        const response = await fetch(urlAPI)
        const newChapter = await response.json()

        if (newChapter)
            setCurrentChapter(newChapter)
    }

    return (
        <div className="flex gap-1 mb-8 flex-wrap">
            {book.chapters && book.chapters.map((ch, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(ch.id)}
                    className={`border-2 font-bold hover:underline p-1 ${currentChapter.id === ch.id ? "bg-white text-black" : "text-white "}`}
                >
                    {ch.title}
                </button>
            ))}
        </div>
    )
}

export default ChapterSelector