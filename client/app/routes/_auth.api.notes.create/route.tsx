import fetchDataJWT from "utils/fetchDataJWT";
import { getJwt } from "~/session/auth";

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL

export const action = async ({ request }: { request: Request }) => {
    const body = await request.json();
    const jwt = await getJwt(request)

    const { entityType, ...restBody } = body;
    try {
        const createdNotes = await fetchDataJWT(
            new URL(`${SERVER_URL}/api/notes`),
            jwt,
            "POST",
            restBody
        );

        return { id: createdNotes.id, entityType, ...createdNotes };
    } catch (error) {
        return { error: 'Failed to create note', status: 500 };
    }
};
