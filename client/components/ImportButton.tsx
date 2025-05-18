import { useEffect, useState, type ChangeEvent } from 'react'
import { XMLParser } from 'fast-xml-parser'

// components
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button } from '@mui/material'
import VisuallyHiddenInput from './VisuallyHiddenInput'

// types
import type { FB2_IBook, FB2_IChapter, FB2_INote } from 'types/FB2File'
import type { IBookPayload, IChaptersPayload, INotesPayload, Payload } from 'types/Payloads'
import { createChapter } from 'api/chapters'
import { createNotes } from 'api/notes'
import { createBook } from 'api/book'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import type { IBook } from 'types/Book'

const ImportButton = () => {
    const [bookData, setBookData] = useState<FB2_IBook | null>(null)
    const navigate = useNavigate()

    const createBookMutation = useMutation({
        mutationKey: ["createBook"],
        mutationFn: createBook,
        onSuccess: (book: IBook) => {
            handleNotesCreation(book.documentId)
            handleChaptersCreation(book.documentId)
        }
    })

    const createChapterMutation = useMutation({
        mutationKey: ["createChapter"],
        mutationFn: createChapter
    })

    const createNotesMutation = useMutation({
        mutationKey: ["createNotes"],
        mutationFn: createNotes
    })

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const text = e.target?.result
            if (typeof text !== 'string') return

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: '@_',
            })

            const jsonObj = parser.parse(text)
            setBookData(jsonObj.FictionBook as FB2_IBook)
        }

        reader.readAsText(file)
    }

    const handleChaptersCreation = (documentId: string): void => {
        if (bookData) {
            let chapters: any[]

            if (!Array.isArray(bookData?.body)) {
                const mainSection = bookData.body.section
                const childSections = mainSection.filter(el => el.section)
                chapters = childSections.map(el => ([...el.section])).flat(Infinity)
            } else {
                chapters = bookData.body[0].section
            }

            chapters.forEach((ch) => {

                const chapterData: IChaptersPayload = {
                    title: ch.title?.p ?? "ПЕРЕДМОВА",
                    paragraphs: ch.p ?? "",
                    book: {
                        connect: [{ documentId, status: 'draft' }, { documentId, status: 'published' }]
                    }
                };

                if (ch.epigraph?.['text-author'] || ch.epigraph?.p)
                    chapterData.epigraph = {
                        author: ch.epigraph?.['text-author'],
                        paragraphs: ch.epigraph?.p,
                    }


                createChapterMutation.mutate({ chapterData })
            });
        }
    }

    const handleNotesCreation = (documentId: string): void => {
        if (bookData) {
            let notes: FB2_INote[] | {} = {};
            if (Array.isArray(bookData?.body)) notes = bookData.body[1].section

            const notesData: INotesPayload = {
                book: {
                    connect: [{ documentId, status: 'draft' }, { documentId, status: 'published' }]
                },
                notes,
            }

            createNotesMutation.mutate({ notesData })


        }
    }

    const handleBookCreation = async (): Promise<void> => {
        if (bookData) {

            const titleInfo = bookData.description["title-info"]

            const bookPayload: IBookPayload = {
                title: titleInfo["book-title"],
                author: {
                    firstName: titleInfo.author['first-name'],
                    middleName: titleInfo.author['middle-name'],
                    lastName: titleInfo.author['last-name']
                },
            }

            createBookMutation.mutate({ bookData: bookPayload })
        }
    }

    useEffect(() => {
        if (bookData && !createChapterMutation.isSuccess) {
            handleBookCreation(); // Create book first
        }

        if (createChapterMutation.isSuccess)
            navigate("/")

    }, [bookData, createChapterMutation.isSuccess]);

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            startIcon={<AddBoxIcon />}
            tabIndex={-1}
            fullWidth
            sx={{ marginBottom: 1 }}
        >
            Book
            <VisuallyHiddenInput
                type="file"
                accept=".fb2"
                onChange={handleFileChange}
            />
        </Button>
    )
}

export default ImportButton
