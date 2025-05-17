import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router"
import { useEffect, useState } from "react"

// utils
import { clientAPIRoutes, serverAPIRoutes } from "consts/endpoints"
import fetchDataJWT from "utils/fetchDataJWT"

// external loader
import { loader as chapterLoader } from "~/routes/_auth.api.books.$bookId.chapters.$id/route"

// session
import { getJwt } from "~/session/auth"

// types
import type { IChapter } from "types/Chapter"
import type { IBook } from "types/Book"

// components
import ChapterSelector from "./ChapterSelector"
import Epigraph from "./Epigraph"
import ParagraphContent from "./ParagraphContent"
import { Button } from "@mui/material"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const jwt = await getJwt(request) // get jwt

    let book: IBook;
    const apiPath = serverAPIRoutes.bookById(params.id as string) // the path to api endpoint
    const newURL = new URL(SERVER_URL + apiPath) // build URL object

    try {
        book = await fetchDataJWT(newURL, jwt) // get book from database

        if (!book) // no book in database
            return redirect("/")

    } catch {
        return redirect("/") // error means get out
    }

    let chapter: IChapter | null = null; // var for storing the chapter
    if (book.chapters.length > 0) {
        const chapterId = book.readingProgress ? book.readingProgress.chapterId : book.chapters[0].id
        chapter = await chapterLoader({ request, params: { bookId: String(book.id), id: String(chapterId) } })
    }

    return { book, initialChapter: chapter }
}



const BookPage: React.FC = () => {
    const { book, initialChapter } = useLoaderData<typeof loader>() // get book and first loaded chapter
    const [currentChapter, setCurrentChapter] = useState<IChapter | null>(null)

    const currentChapterIndex = book.chapters.findIndex((ch) => {
        if (currentChapter && ch.id === currentChapter.id)
            return ch.id
    })

    useEffect(() => {
        if (currentChapter && currentChapter !== initialChapter) {
            const payload = {
                readingProgress: {
                    chapterId: currentChapter.id,
                    paragraphIndex: 0
                }
            }

            fetch(clientAPIRoutes.updateBook(book.id), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        }

        if (!currentChapter && initialChapter) {
            setCurrentChapter(initialChapter)
        }
    }, [currentChapter])

    const handleNavigateChapter = async (chapterId: number) => {
        const res = await fetch(clientAPIRoutes.chapterOfBook(book.id, chapterId))
        const data = await res.json()
        setCurrentChapter(data)

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    const handleRemove = () => {
        fetch(clientAPIRoutes.deleteBook(book.id), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return redirect("/")
    }

    return (
        <div className="p-6 max-w-3xl mx-auto relative">
            <div className="absolute -right-[150px] top-[130px]">
                <Button variant="contained" color="error" onClick={handleRemove}>Remove the book</Button>
            </div>
            <h1 className="text-3xl font-bold mb-6">{book.title}</h1>

            {
                currentChapter && <>

                    {/** Selection Tab for Chapters */}
                    <ChapterSelector book={book} setCurrentChapter={setCurrentChapter} currentChapter={currentChapter} />

                    {/** Chapter Content */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">{currentChapter.title}</h2>

                        {/** Epigraph Content */}
                        <Epigraph epigraphData={currentChapter.epigraph} />

                        {/** Text itself */}
                        <ParagraphContent list={currentChapter.paragraphs} />

                        {/** Next / Previous chapter selection */}
                        <div className="flex justify-between">
                            <Button onClick={() => handleNavigateChapter(book.chapters[currentChapterIndex - 1].id)}
                                variant="contained" disabled={!(currentChapterIndex > 0)}>
                                <ChevronLeftIcon />
                                {currentChapterIndex > 0 && book.chapters[currentChapterIndex - 1].title}
                            </Button>

                            <Button onClick={() => handleNavigateChapter(book.chapters[currentChapterIndex + 1].id)}
                                variant="contained" disabled={!(currentChapterIndex < book.chapters.length - 1)}>
                                {currentChapterIndex < book.chapters.length - 1 && book.chapters[currentChapterIndex + 1].title}
                                <ChevronRightIcon />
                            </Button>
                        </div>
                    </div>

                </>
            }
        </div>

    )
}

export default BookPage