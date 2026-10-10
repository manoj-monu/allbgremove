import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Default Demo Studio account or dynamic session generator
    const defaultName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

    const user = {
      id: 'usr_' + Buffer.from(cleanEmail).toString('hex').substring(0, 10),
      name: formattedName,
      email: cleanEmail,
      studio: formattedName + ' Photo Studio',
      credits: 10,
      lastLogin: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: user,
      token: 'jwt_' + Buffer.from(cleanEmail).toString('base64') + '_' + Date.now()
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
