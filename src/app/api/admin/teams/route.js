import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuthServer';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verify admin authentication
    const authenticated = await isAdminAuthenticated();
    
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch teams data from Supabase
    const { data: teams, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching teams:', error);
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      );
    }
    
    // Calculate statistics
    const totalTeams = teams.length;
    const totalMembers = teams.reduce((sum, team) => {
      // Count members based on your database schema
      // Adjust this based on your actual schema
      return sum + (team.total_members || 0);
    }, 0);
    
    return NextResponse.json({
      success: true,
      teams,
      statistics: {
        totalTeams,
        totalMembers
      }
    });
    
  } catch (error) {
    console.error('Teams API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function PUT(request) {
  try {
    // Verify admin authentication
    const authenticated = await isAdminAuthenticated();
    
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const teamData = await request.json();
    
    if (!teamData.team_id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }
    
    // Prepare update data - only include editable fields
    const updateData = {
      team_name: teamData.team_name,
      total_members: teamData.total_members,
      leader_name: teamData.leader_name,
      leader_email: teamData.leader_email,
      leader_year: teamData.leader_year,
      member2_name: teamData.member2_name || null,
      member2_email: teamData.member2_email || null,
      member2_year: teamData.member2_year || null,
      member3_name: teamData.member3_name || null,
      member3_email: teamData.member3_email || null,
      member3_year: teamData.member3_year || null,
      member4_name: teamData.member4_name || null,
      member4_email: teamData.member4_email || null,
      member4_year: teamData.member4_year || null,
    };
    
    // Update team in Supabase
    const { data, error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('team_id', teamData.team_id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating team:', error);
      return NextResponse.json(
        { error: 'Failed to update team' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      team: data
    });
    
  } catch (error) {
    console.error('Update team API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}