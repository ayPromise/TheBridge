import { Button, styled } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useEffect, useState, type ChangeEvent } from 'react'
import { XMLParser } from 'fast-xml-parser'
import type { FB2_IAuthor, FB2_IBook, FB2_IChapter, FB2_INote, FB2_ITitleInfo } from 'types/FB2File'
import { useFetcher } from 'react-router'


export interface IBookMutate {
    title: string;
    chapters: FB2_IChapter[] | [];
    notes: FB2_INote[] | [];
    author: FB2_IAuthor | null;

}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

const ImportButton = () => {
    const [bookData, setBookData] = useState<FB2_IBook | null>(null)
    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.id) {
                if (fetcher.data.entityType === 'book') {
                    handleNotesExctraction(fetcher.data.documentId)
                    handleChaptersCreation(fetcher.data.documentId)
                }
            }
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

    const handleChaptersCreation = async (documentId: number) => {
        if (bookData) {
            const chapters = bookData?.body[0].section as FB2_IChapter[]
            const pathApi = '/api/chapters/create'

            chapters.forEach((ch) => {
                const epigraph = {
                    author: ch.epigraph?.['text-author'],
                    paragraphs: ch.epigraph?.p
                }
                let chapterForMutation = {
                    data: {
                        title: ch.title.p,
                        paragraphs: ch.p,
                        book: {
                            connect: [{ documentId, status: 'draft' }, { documentId, status: 'published' }]
                        },
                    },
                    entityType: 'chapter',
                }

                if (epigraph.author || epigraph.paragraphs)
                    chapterForMutation.data.epigraph = epigraph

                fetcher.submit(JSON.stringify(chapterForMutation),
                    {
                        method: 'POST',
                        action: pathApi,
                        encType: 'application/json',
                    })
            })

        }
    }

    const handleNotesExctraction = (documentId: number) => {
        if (bookData) {
            const notes = bookData?.body[1].section as FB2_INote[]
            let noteForMutation = {
                data: {
                    book: {
                        connect: [{ documentId, status: 'draft' }, { documentId, status: 'published' }]
                    },
                    notes: notes,
                },
                entityType: 'notes',
            }

            const pathApi = '/api/notes/create'
            fetcher.submit(JSON.stringify(noteForMutation),
                {
                    method: 'POST',
                    action: pathApi,
                    encType: 'application/json',
                })

        }
    }

    const handleTitleInfoExtraction = () => {
        if (bookData) {
            const titleInfo = bookData.description["title-info"]
            const titleForMutation = {
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

            const pathApi = 'api/books/create'

            fetcher.submit(JSON.stringify(titleForMutation), {
                method: "POST",
                action: pathApi,
                encType: 'application/json',
            })
        }
    }

    useEffect(() => {
        if (bookData) {
            handleTitleInfoExtraction(); // Create book first
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
