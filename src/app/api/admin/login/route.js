import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminToken, setAdminCookie } from '@/lib/adminAuthServer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Verify credentials
    const isValid = verifyAdminCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Create token
    const token = createAdminToken(username);
    
    // Set cookie
    await setAdminCookie(token);
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
