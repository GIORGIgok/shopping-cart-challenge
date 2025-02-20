import { NextRequest } from 'next/server';

export const setVisitorToken = (token: string) => {
  document.cookie = `visitor_token=${token}; path=/; Secure=true; SameSite=Strict; max-age=10`;
};

export const getVisitorToken = (req: NextRequest) =>
  req.cookies.get('visitor_token')?.value;

// export const removeVisitorToken = () => Cookies.remove('visitor_token');
