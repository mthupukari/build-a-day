import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }

  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const from = req.nextUrl.searchParams.get('from') || '/';
  const res = NextResponse.json({ ok: true, redirect: from });
  res.cookies.set('rc-auth', password, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return res;
}
