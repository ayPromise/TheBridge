import { Button } from '@mui/material'
import React from 'react'
import type { IChapter } from 'types/Chapter'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ChapterNavigationProps {
    handleNavigateChapter: (chapterId: number) => void,
    currentChapter: IChapter | null,
    allChapters: { title: string, id: number }[]
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({ handleNavigateChapter, currentChapter, allChapters }) => {
    const currentChapterIndex = allChapters.findIndex((ch) => {
        if (currentChapter && ch.id === currentChapter.id)
            return ch.id
    })

    return (
        <div className="flex justify-between">
            <Button onClick={() => handleNavigateChapter(allChapters[currentChapterIndex - 1].id)}
                variant="contained" disabled={!(currentChapterIndex > 0)}>
                <ChevronLeftIcon />
                {currentChapterIndex > 0 && allChapters[currentChapterIndex - 1].title}
            </Button>

            <Button onClick={() => handleNavigateChapter(allChapters[currentChapterIndex + 1].id)}
                variant="contained" disabled={!(currentChapterIndex < allChapters.length - 1)}>
                {currentChapterIndex < allChapters.length - 1 && allChapters[currentChapterIndex + 1].title}
                <ChevronRightIcon />
            </Button>
        </div>
    )
}

export default ChapterNavigation