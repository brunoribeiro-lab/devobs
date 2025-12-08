import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/utils/userCookie';

export async function GET(req: NextRequest ) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '/';
  const res = NextResponse.redirect(new URL(siteUrl, req.url));

  clearAuthCookies(res);

  return res;
}