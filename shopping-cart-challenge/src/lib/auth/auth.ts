import { NextRequest } from 'next/server';
import { CLIENT_VISITOR_TOKEN, SERVER_VISITOR_TOKEN } from '@/constants/data';

export const setVisitorToken = (token: string) => {
  document.cookie = `${CLIENT_VISITOR_TOKEN}${token}; path=/; Secure=true; SameSite=Strict; max-age=3600`; // 1hr
};

export const getVisitorToken = (req: NextRequest) =>
  req.cookies.get(SERVER_VISITOR_TOKEN)?.value;

// export const removeVisitorToken = () => Cookies.remove('visitor_token');
