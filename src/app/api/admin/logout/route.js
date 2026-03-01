import { NextResponse } from 'next/server';
import { removeAdminCookie } from '@/lib/adminAuthServer';

export async function POST() {
  try {
    // Remove the admin cookie
    await removeAdminCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
