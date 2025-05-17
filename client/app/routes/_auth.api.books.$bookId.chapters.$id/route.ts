import { redirect, type LoaderFunctionArgs } from "react-router";

// session
import { getJwt } from "~/session/auth";

// utils
import fetchDataJWT from "utils/fetchDataJWT";
import { serverAPIRoutes } from "consts/endpoints";

// .env
const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL;

export const loader = async ({ request, params }: Omit<LoaderFunctionArgs, 'context'>) => {
  const jwt = await getJwt(request); // get jwt

  try{
    const apiPath = serverAPIRoutes.chapterOfBook(params.bookId as string, params.id as string) // the path to api endpoint
    const chapter = await fetchDataJWT(new URL(SERVER_URL+apiPath), jwt) // get chapter of book by id from database
    
    if(!chapter) redirect("/")

    return chapter
  }catch(error){
    redirect("/")
  }
};
