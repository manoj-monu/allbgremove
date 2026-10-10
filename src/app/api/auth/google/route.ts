import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, email, name, picture, googleId } = body;

    let userEmail = email;
    let userName = name;
    let userPicture = picture;
    let userGoogleId = googleId;

    // If Google ID token credential was provided, decode JWT payload
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          userEmail = payload.email || userEmail;
          userName = payload.name || userName;
          userPicture = payload.picture || userPicture;
          userGoogleId = payload.sub || userGoogleId;
        }
      } catch (e) {
        console.error('Failed to decode Google JWT:', e);
      }
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Valid Google account email is required' }, { status: 400 });
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const displayName = userName?.trim() || cleanEmail.split('@')[0];

    const user = {
      id: 'usr_g_' + (userGoogleId || Buffer.from(cleanEmail).toString('hex').substring(0, 10)),
      name: displayName,
      email: cleanEmail,
      picture: userPicture || null,
      provider: 'google',
      studio: displayName + ' Photo Studio',
      credits: 5, // 5 Free Welcome Credits
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Google Sign-In successful',
      user: user,
      token: 'jwt_google_' + Buffer.from(cleanEmail).toString('base64') + '_' + Date.now()
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
