import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = [
	{
		path: '/auth',
		whenAuthenticated: 'redirect',
	},
	{
		path: '/',
		whenAuthenticated: 'keep',
	},
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/auth';

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	const publicRoute = publicRoutes.find((route) => route.path === path);

	const token = request.cookies?.get('refreshToken');

	if (!token && publicRoute) {
		return NextResponse.next();
	}

	if (!token && !publicRoute) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

		return NextResponse.redirect(redirectUrl);
	}

	if (publicRoute && publicRoute.whenAuthenticated === 'redirect' && token) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = '/chat';

		return NextResponse.redirect(redirectUrl);
	}

	if (token && !publicRoute) {
		const decodedToken = jwtDecode(token?.value);
		const expirationDate = decodedToken.exp;

		if (expirationDate && dayjs.unix(expirationDate).isBefore(dayjs())) {
			request.cookies.delete('refreshToken');

			const redirectUrl = request.nextUrl.clone();
			redirectUrl.pathname = '/';

			return NextResponse.redirect(redirectUrl);
		}

		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/auth',
		'/chat/:path*',
		'/history/:path*',
		'/settings/:path*',
		'/post-details/:path*',
	],
};
