import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/register' || path === '/';
    const token = request.cookies.get('accessToken')?.value || '';


    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/user/:path*', // Protect user dashboard
        '/admin/:path*',
        '/rooms',    
    ],
};
