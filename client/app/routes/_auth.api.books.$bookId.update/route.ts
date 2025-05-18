import { serverAPIRoutes } from "consts/endpoints"
import { type ActionFunctionArgs } from "react-router"
import fetchDataJWT from "utils/fetchDataJWT"
import { getJwt} from "~/session/auth"

const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL

export const action = async ({request, params} : ActionFunctionArgs) =>{
    const body = await request.json();
    const jwt = await getJwt(request)
    const bookId = params.bookId

    if(!bookId)
        return {status:400, error:"Bad request. No valid bookId"}

    if(!jwt)
        return {status:401, error:"Unauthorized"}


    const url = new URL(`${SERVER_URL}${serverAPIRoutes.bookById(bookId)}`)
    return await fetchDataJWT(url, jwt, "PATCH", body)
}