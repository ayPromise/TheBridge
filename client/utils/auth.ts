import { jwtDecode } from "jwt-decode"
import type UserSession from "types/UserSession"

const setUserSession = (jwt:string, user:string):void=>{
    localStorage.setItem("jwt", jwt)
    localStorage.setItem("user", user)
}

const getUserSession = (): UserSession | null=>{
    
    if(!validateUserSession())
        return null

    const user = localStorage.getItem("user")
    if(user)
        return JSON.parse(user)

    return null
}

const clearUserSession = (): void=>{
    const user = localStorage.getItem("user")
    if(user){
        localStorage.removeItem("user")
    }

    const jwt = getJwt()

    if(jwt)
        localStorage.removeItem("jwt")
}

const validateUserSession = () : boolean =>{
    if (typeof window === "undefined") return false; // SSR guard

    const jwt = getJwt()

    if(!jwt) return false

    try{
        const expirationTime = jwtDecode(jwt).exp as number
        const currentTime = Date.now() / 1000

        return expirationTime > currentTime
    }catch{
        return false
    }
}

const getJwt = () : string | null => localStorage.getItem("jwt")

export {setUserSession, getUserSession, clearUserSession, validateUserSession, getJwt}