import authConfig from "./auth.config"
import NextAuth from "next-auth"
import {
        publicRoutes,
        authRoutes,
        apiRoutePrefix,
        DEFAULT_LOGIN_REDIRECT
} from'@/routes'
import next from "next"

const {auth}=NextAuth(authConfig)
 
export default auth((req) => {
    const {nextUrl}=req
    const isLoggedIn=!!req.auth
    const isApiAuthRoute=nextUrl.pathname.startsWith(apiRoutePrefix)
    const isPublicRoute=publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute=authRoutes.includes(nextUrl.pathname)
  
    if (isApiAuthRoute){
        return null
    }
    if(isAuthRoute){
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return null
    }
    if(!isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL('/auth/login',nextUrl))
    }
   return null
})


// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
      ],
}