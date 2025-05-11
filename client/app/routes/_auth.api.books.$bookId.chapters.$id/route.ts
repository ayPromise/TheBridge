import { redirect, type LoaderFunctionArgs } from "react-router";

// session
import { getJwt } from "~/session/auth";

// utils
import fetchDataJWT from "utils/fetchDataJWT";

// .env
const SERVER_URL = import.meta.env.VITE_STRAPI_BACKEND_URL;

export const loader = async ({ request, params }: Omit<LoaderFunctionArgs, 'context'>) => {
  const jwt = await getJwt(request); // get jwt

  try{
    const apiPath = `/api/books/${params.bookId}/chapters/${params.id}` // the path to api endpoint
    const newURL = new URL(SERVER_URL+apiPath) // build URL object
    const chapter = await fetchDataJWT(newURL, jwt) // get chapter of book by id from database
    
    if(!chapter) redirect("/")

    return chapter
  }catch(error){
    redirect("/")
  }
};
