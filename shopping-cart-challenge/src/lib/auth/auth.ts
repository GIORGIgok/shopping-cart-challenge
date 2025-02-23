import { NextRequest } from 'next/server';
import { VISITOR_TOKEN } from '@/constants/data';

export const setVisitorToken = (token: string) => {
  document.cookie = `${VISITOR_TOKEN}=${token}; path=/; Secure=true; SameSite=Strict; max-age=3600`; // 1hr
};

export const getVisitorToken = (req: NextRequest) =>
  req.cookies.get(VISITOR_TOKEN)?.value;
