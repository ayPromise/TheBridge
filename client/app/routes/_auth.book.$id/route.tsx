import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router"
import { useEffect, useState } from "react"

// external loader
import { loader as chapterLoader } from "~/routes/_auth.api.books.$bookId.chapters.$id/route"

// session
import { getJwt } from "~/session/auth"

// types
import type { IChapter } from "types/Chapter"
import type { IBook } from "types/Book"

// redux
import { useDispatch } from "react-redux"
import { setChapters } from "features/chapters/chapterSlice"
import { store } from "store"

// components
import ChapterSelector from "./ChapterSelector"
import Epigraph from "./Epigraph"
import ParagraphContent from "./ParagraphContent"
import fetchDataJWT from "utils/fetchDataJWT"

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const jwt = await getJwt(request) // get jwt
    const books = store.getState().books.value; // get books in redux store
    let book = books.find((book) => book.id === Number(params.id)); // get book we search for in redux


    if (!book) {
        // if book doesnt exist in redux

        const apiPath = `/api/books/${params.id}` // the path to api endpoint
        const newURL = new URL(SERVER_URL + apiPath) // build URL object

        try {
            book = await fetchDataJWT(newURL, jwt) // get book from database

            if (!book) // no book in database
                return redirect("/")

        } catch {
            return redirect("/") // error means get out
        }
    }

    const chapter = await chapterLoader({ request, params: { bookId: String(book.id), id: String(book.chapters[0].id) } }) // we load chapter from database fetching _auth.api.books.$bookId.chapters.$id page

    if (!chapter)
        return redirect("/") // no chapter in database

    return { book: book as IBook, initialChapter: chapter as IChapter }
}



const BookPage: React.FC = () => {
    const { book, initialChapter } = useLoaderData<typeof loader>() // get book and first loaded chapter
    const [currentChapter, setCurrentChapter] = useState<IChapter>(initialChapter) // state for current chapter
    const dispatch = useDispatch() // dispatch from redux

    useEffect(() => {
        dispatch(setChapters([initialChapter])) // on first render we upload chapters to redux
    }, [])

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{book.title}</h1>

            {/** Selection Tab for Chapters */}
            <ChapterSelector book={book} setCurrentChapter={setCurrentChapter} currentChapter={currentChapter} />

            {/** Chapter Content */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">{currentChapter.title}</h2>

                {/** Epigraph Content */}
                <Epigraph epigraphData={currentChapter.epigraph} />

                {/** Text itself */}
                <ParagraphContent list={currentChapter.paragraphs} />
            </div>
        </div>

    )
}

export default BookPage