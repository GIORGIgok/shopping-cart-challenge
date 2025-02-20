import { NextResponse, NextRequest } from 'next/server';
import { getVisitorToken } from './lib/auth/auth';

// for protecting routes
export function middleware(req: NextRequest) {
  const token = getVisitorToken(req);
  //   console.log('Token:', token);

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products', '/cart'],
};
