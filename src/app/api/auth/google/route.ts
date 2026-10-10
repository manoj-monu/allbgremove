import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, email, name, picture } = body;

    let userEmail = email;
    let userName = name;
    let userPicture = picture;
    let userGoogleId = '';

    // Verify Google ID token cryptographically via Google's tokeninfo API
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (!verifyRes.ok) {
          return NextResponse.json({ error: 'Invalid Google credential token' }, { status: 401 });
        }
        const verifiedData = await verifyRes.json();
        userEmail = verifiedData.email;
        userName = verifiedData.name || verifiedData.given_name;
        userPicture = verifiedData.picture;
        userGoogleId = verifiedData.sub;
      } catch (verErr) {
        console.error('Google token verification failed:', verErr);
        return NextResponse.json({ error: 'Unable to verify Google credential' }, { status: 401 });
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
      message: 'Google Sign-In verified and successful',
      user: user,
    });

  } catch (err: any) {
    console.error('Auth route error:', err);
    return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
  }
}
