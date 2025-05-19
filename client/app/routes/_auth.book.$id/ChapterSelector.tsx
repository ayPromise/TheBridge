import { Button } from '@mui/material'
import { fetchChapter } from 'api/book'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'

// types
import type { IBook } from 'types/Book'
import type { IChapter } from 'types/Chapter'

interface ChapterSelectorProps {
    book: IBook,
    currentChapter: IChapter,
    setCurrentChapter: React.Dispatch<React.SetStateAction<IChapter | null>>
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ book, setCurrentChapter, currentChapter }) => {
    const [isExpandedElement, setIsExpandedElement] = useState<boolean>(false)
    const navigate = useNavigate()
    const handleClick = async (id: number) => {
        const chapter = await fetchChapter({ chapterId: id, bookId: book.id })
        if (chapter) {
            setCurrentChapter(chapter)
            const sameChapterFromBookState = book.chapters.find(el => el.id === currentChapter.id)
            if (currentChapter.completed && !sameChapterFromBookState?.completed)
                navigate("")
        }
    }

    const completedChapterStyles = "bg-slate-500 font-normal"

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: 1 }}
                onClick={() => setIsExpandedElement(!isExpandedElement)}>
                {
                    isExpandedElement ? "Hide chapters" : "Show chapters"
                }
            </Button>
            {isExpandedElement && <div className="flex gap-1 mb-8 flex-wrap">
                {book.chapters && book.chapters.map((ch, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(ch.id)}
                        className={`border-2 font-bold hover:underline cursor-pointer p-1 ${currentChapter.id === ch.id ? "bg-white text-black" : "text-white "} ${ch.completed ? completedChapterStyles : ""}`}
                    >
                        {ch.title}
                    </button>
                ))}
            </div>}
        </>
    )
}

export default ChapterSelector