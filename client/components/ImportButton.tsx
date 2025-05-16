import { useEffect, useState, type ChangeEvent } from 'react'
import { XMLParser } from 'fast-xml-parser'

// consts
import { clientAPIRoutes } from 'consts/endpoints'

// hooks
import useFetcherSubmit from 'hooks/useFetcherSubmit'

// components
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button } from '@mui/material'
import VisuallyHiddenInput from './VisuallyHiddenInput'

// types
import type { FB2_IBook, FB2_IChapter, FB2_INote } from 'types/FB2File'
import type { IBookPayload, IChaptersPayload, INotesPayload, Payload } from 'types/Payloads'

const ImportButton = () => {
    const [bookData, setBookData] = useState<FB2_IBook | null>(null)
    const { fetcher, submit } = useFetcherSubmit()

    useEffect(() => {
        if (fetcher.data && fetcher.data.id && fetcher.data.entityType === 'book') {
            handleNotesCreation(fetcher.data.documentId)
            handleChaptersCreation(fetcher.data.documentId)
        }
    }, [fetcher.data]);


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

    const handleChaptersCreation = (documentId: number): void => {
        if (bookData) {
            const chapters = bookData?.body[0].section as FB2_IChapter[]

            chapters.forEach((ch) => {

                const data: IChaptersPayload = {
                    title: ch.title.p,
                    paragraphs: ch.p,
                    book: {
                        connect: [{ documentId, status: 'draft' }, { documentId, status: 'published' }]
                    }
                };

                if (ch.epigraph?.['text-author'] || ch.epigraph?.p)
                    data.epigraph = {
                        author: ch.epigraph?.['text-author'],
                        paragraphs: ch.epigraph?.p,
                    }

                let chapterPayload: Payload<IChaptersPayload> = {
                    data: data,
                    entityType: "chapter"
                };

                submit(chapterPayload, clientAPIRoutes.createChapters)
            });
        }
    }

    const handleNotesCreation = (documentId: number): void => {
        if (bookData) {
            const notes = bookData?.body[1].section as FB2_INote[]
            if (!notes) return

            const notesPayload: Payload<INotesPayload> = {
                data: {
                    book: {
                        connect: [{ documentId, status: 'draft' }, { documentId, status: 'published' }]
                    },
                    notes: notes,
                },
                entityType: 'notes',
            }

            submit(notesPayload, clientAPIRoutes.createNotes)

        }
    }

    const handleBookCreation = (): void => {
        if (bookData) {

            const titleInfo = bookData.description["title-info"]

            const bookPayload: Payload<IBookPayload> = {
                data: {
                    title: titleInfo["book-title"],
                    author: {
                        firstName: titleInfo.author['first-name'],
                        middleName: titleInfo.author['middle-name'],
                        lastName: titleInfo.author['last-name']
                    },
                },
                entityType: 'book'
            }

            submit(bookPayload, clientAPIRoutes.createBook)
        }
    }

    useEffect(() => {
        if (bookData) {
            handleBookCreation(); // Create book first
        }
    }, [bookData]);

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            startIcon={<AddBoxIcon />}
            tabIndex={-1}
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
