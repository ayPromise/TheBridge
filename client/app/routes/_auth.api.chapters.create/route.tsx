import { serverAPIRoutes } from "consts/endpoints";
import fetchDataJWT from "utils/fetchDataJWT";
import { getJwt } from "~/session/auth";

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL

export const action = async ({ request }: { request: Request }) => {
    const body = await request.json();
    const jwt = await getJwt(request)

    const { entityType, ...restBody } = body;

    try {
        const createdChapter = await fetchDataJWT(
            new URL(`${SERVER_URL}${serverAPIRoutes.chapters}`),
            jwt,
            "POST",
            restBody
        );
        return { id: createdChapter.id, entityType, ...createdChapter };
    } catch (error) {
        return { error: 'Failed to create chapter', status: 500 };
    }
};
