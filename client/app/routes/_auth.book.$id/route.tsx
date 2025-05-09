import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router"
import { getJwt } from "~/session/auth"
import type { Book } from "types/Book"

const backendURL = import.meta.env.VITE_STRAPI_BACKEND_URL

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const jwt = await getJwt(request)

    const apiPath = `/api/books/${params.id}`
    const newURL = new URL(backendURL + apiPath)

    try {
        const response = await fetch(newURL, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()
        if (!data.data)
            return redirect("/")

        return { book: data.data as Book }
    } catch {
        return redirect("/")
    }
}


const Book = () => {
    const { book } = useLoaderData<any>()

    return (
        <div>{book.title}</div>
    )
}

export default Book