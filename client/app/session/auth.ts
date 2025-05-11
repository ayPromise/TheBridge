import { jwtDecode } from "jwt-decode"
import { createCookieSessionStorage } from "react-router";
import type UserSession from "types/User"


const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    secrets: [import.meta.env.VITE_SESSION_SECRET],
  },
});

const setUserSession = async (request:Request, jwt:string, user:string):Promise<Headers>=>{
    const session = await getSession(request.headers.get("Cookie"))
    session.set("jwt", jwt)
    session.set("user", JSON.stringify(user))

    return new Headers({
        "Set-Cookie":await commitSession(session)
    })
}

const getUserSession = async (request: Request): Promise<UserSession | null>=>{
    const isValidUser = await validateUserSession(request)
    if(!isValidUser)
        return null

    const session = await getSession(request.headers.get("Cookie"))
    const user = session.get("user")
    if(user)
        return JSON.parse(user)

    return null
}

const clearUserSession = async (request:Request): Promise<Headers>=>{
    const session = await getSession(request.headers.get("Cookie"));
    const cookie = await destroySession(session)
    return new Headers({
        "Set-Cookie": cookie,
    });
}

const validateUserSession = async (request: Request): Promise<boolean> => {
  const session = await getSession(request.headers.get("Cookie"));
  const jwt = session.get("jwt");

  if (!jwt) {
    return false;
  }

  try {
    const expirationTime = jwtDecode(jwt).exp as number;
    const currentTime = Date.now() / 1000;
    return expirationTime > currentTime;
  } catch {
    return false;
  }
};

const getJwt = async (request: Request): Promise<string | null> => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("jwt");
};

export {setUserSession, getUserSession, clearUserSession, validateUserSession, getJwt}