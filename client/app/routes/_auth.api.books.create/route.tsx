import type IUserSession from "types/User";
import fetchDataJWT from "utils/fetchDataJWT";
import { getJwt, getUserSession } from "~/session/auth";

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL

export const action = async ({ request }: { request: Request }) => {
    const body = await request.json();
    const jwt = await getJwt(request)
    const user = await getUserSession(request) as IUserSession
    const { entityType, ...restBody } = body;

    const newBodyWithOwner = {
        data: {
            ...restBody.data,
        }
    }

    try {
        const createdBook = await fetchDataJWT(
            new URL(`${SERVER_URL}/api/books`),
            jwt,
            "POST",
            restBody
        );

        return { id: createdBook.id, entityType, ...createdBook };
    } catch (error) {
        return { error: 'Failed to create book', status: 500 };
    }
};
