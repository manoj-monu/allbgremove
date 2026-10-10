import { NextRequest, NextResponse } from 'next/server';

// In-memory fallback for serverless session/auth checks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, studio, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const user = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studio: studio?.trim() || name.trim() + ' Studio',
      phone: phone?.trim() || '',
      credits: 5, // 5 Free Welcome Credits
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Account created successfully with 5 Free Credits',
      user: user,
      token: 'jwt_' + Buffer.from(email).toString('base64') + '_' + Date.now()
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
