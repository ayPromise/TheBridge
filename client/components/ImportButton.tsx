import { useEffect, useState, type ChangeEvent } from 'react'
import { XMLParser } from 'fast-xml-parser'

// consts
import { clientAPIRoutes } from 'consts/endpoints'

// components
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Button } from '@mui/material'
import VisuallyHiddenInput from './VisuallyHiddenInput'

// types
import type { FB2_IBook, FB2_IChapter, FB2_INote } from 'types/FB2File'
import type { IBookPayload, IChaptersPayload, INotesPayload, Payload } from 'types/Payloads'
import type { IBook } from 'types/Book'

const ImportButton = () => {
    const [bookData, setBookData] = useState<FB2_IBook | null>(null)
    const [createdBook, setCreatedBook] = useState<IBook | null>(null)

    useEffect(() => {
        if (createdBook) {
            handleNotesCreation(createdBook.documentId)
            handleChaptersCreation(createdBook.documentId)
        }
    }, [createdBook]);


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

                fetch(clientAPIRoutes.createChapters, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(chapterPayload)
                });
            });
        }
    }

    const handleNotesCreation = (documentId: string): void => {
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

            fetch(clientAPIRoutes.createNotes, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(notesPayload)
            });

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

            fetch(clientAPIRoutes.createBook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookPayload)
            }).then(res => res.json()).then((data) => setCreatedBook(data))
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
