import { NextResponse } from 'next/server';

export function middleware(request) {
    // 1. Get the token from cookies
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;  //Detect current route

    // 2. If trying to access dashboard without a token, redirect to login
    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. If logged in and trying to access login page, redirect to dashboard
    if (pathname === '/' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
    matcher: ['/', '/dashboard/:path*'],
};