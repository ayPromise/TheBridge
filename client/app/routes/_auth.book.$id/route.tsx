import { redirect, useLoaderData, useNavigate, type LoaderFunctionArgs } from "react-router"
import { useEffect, useRef, useState } from "react"

// utils
import { serverAPIRoutes } from "consts/endpoints"
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
import ChapterNavigation from "./ChapterNavigation"
import { useMutation } from "@tanstack/react-query"
import { fetchChapter, removeBook, updateBook } from "api/book"
import ProgressBar from "./ProgressBar"
import { updateChapter } from "api/chapters"

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
        let chapterId = book.readingProgress ? book.readingProgress.chapterId : book.chapters[0].id
        chapter = await chapterLoader({
            request, params: { bookId: String(book.id), id: String(chapterId) }
        })
    }
    return { book, initialChapter: chapter }
}



const BookPage: React.FC = () => {
    const { book, initialChapter } = useLoaderData<typeof loader>() // get book and first loaded chapter
    const [currentChapter, setCurrentChapter] = useState<IChapter | null>(null)
    const navigate = useNavigate()

    const updateBookMutation = useMutation({
        mutationKey: ["updateBook"],
        mutationFn: updateBook
    });

    const removeBookMutation = useMutation({
        mutationKey: ["removeBook"],
        mutationFn: removeBook,
        onSuccess: () => navigate("/")
    })

    const updateChapterCompletionMutation = useMutation({
        mutationKey: ["updateChapter", currentChapter?.id],
        mutationFn: updateChapter,
        onSuccess: (updatedChapter: IChapter) => {
            setCurrentChapter(updatedChapter)
        }
    })

    useEffect(() => {
        if (currentChapter
            && currentChapter !== initialChapter
        ) {

            if (currentChapter?.book.id !== book.id) {
                setCurrentChapter(initialChapter)
            } else {

                const payload = {
                    readingProgress: {
                        chapterId: currentChapter.id,
                        paragraphIndex: 0
                    }
                }
                updateBookMutation.mutate({ bookId: book.id, bookPayload: payload })
            }
        }


        if (!currentChapter && initialChapter) {
            setCurrentChapter(initialChapter)
        }

    }, [currentChapter, initialChapter])

    const handleNavigateChapter = async (chapterId: number) => {
        const chapter = await fetchChapter({ bookId: book.id, chapterId })

        const sameCurrentChapterFromBookState = book.chapters.find((ch) => ch.id === currentChapter?.id)

        if (chapter) {
            setCurrentChapter(chapter)

            if (currentChapter?.completed && !sameCurrentChapterFromBookState?.completed) {
                navigate("") // we navigate to the same page to push the new fetch of chapters to keep up with completed ones
            } else {
                window.scrollTo({ // we move to the top of the screen instead
                    top: 0,
                    behavior: "instant"
                });
            }
        }
    }

    const handleCompleteChapter = () => {

        if (currentChapter && !currentChapter.completed && !updateChapterCompletionMutation.isPending) {
            const payload = {
                completed: true
            };

            updateChapterCompletionMutation.mutate({
                chapterId: currentChapter.id,
                chapterData: payload
            });
        }
    }
    const completeChapterFunctionRef = useRef(handleCompleteChapter)
    completeChapterFunctionRef.current = handleCompleteChapter

    return (
        <div className="mx-auto flex-grow">
            {currentChapter && <ProgressBar onFinish={() => completeChapterFunctionRef.current()} />}

            <div className="max-w-3xl py-6 mx-auto relative">

                <div className="absolute right-[0] top-[25px]">
                    <Button variant="contained" color="error" onClick={() => removeBookMutation.mutate({ bookId: book.id })}>
                        Remove the book
                    </Button>
                </div>

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
                            <ChapterNavigation currentChapter={currentChapter} allChapters={book.chapters} handleNavigateChapter={handleNavigateChapter} />
                        </div>

                    </>
                }
            </div>
        </div>

    )
}

export default BookPage