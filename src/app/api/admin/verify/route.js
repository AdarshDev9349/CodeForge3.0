import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuthServer';

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    
    return NextResponse.json({
      success: true,
      authenticated
    });
    
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    );
  }
}
