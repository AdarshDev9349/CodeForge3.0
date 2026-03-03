# Supabase Setup Guide

## 📋 Quick Setup Steps

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details and wait for setup to complete

### 2. Get Your API Credentials
1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click on **API** in the sidebar
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the long key under "Project API keys")

### 3. Update Environment Variables
1. Open `.env.local` in your project root
2. Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

### 4. Create the Teams Table
The registration form stores all team data in a single row with individual columns for each member.

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Create teams table with individual columns for each member
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  team_name TEXT NOT NULL,
  total_members INTEGER NOT NULL,
  password TEXT NOT NULL,
  
  -- Team Leader (Member 1)
  leader_name TEXT NOT NULL,
  leader_email TEXT UNIQUE NOT NULL,
  leader_year TEXT NOT NULL,
  
  -- Member 2
  member2_name TEXT,
  member2_email TEXT,
  member2_year TEXT,
  
  -- Member 3
  member3_name TEXT,
  member3_email TEXT,
  member3_year TEXT,
  
  -- Member 4
  member4_name TEXT,
  member4_email TEXT,
  member4_year TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_teams_team_id ON teams(team_id);
CREATE INDEX idx_teams_leader_email ON teams(leader_email);
CREATE INDEX idx_teams_team_name ON teams(team_name);
```

### 5. Test Your Login System
1. Restart your development server: `npm run dev`
2. Click the **Login** button in the top right
3. Try registering a new team or logging in with existing credentials
4. Check your Supabase dashboard > **Table Editor** > **teams** to see the entries

## 🔄 Login/Registration Flow

1. **Enter Email** → System checks database for existing account
2. **If Email Exists (Returning User)**:
   - Show login form with password field
   - Verify credentials against database
   - On success: Save session, redirect to home
   - Login button changes to team name with dropdown menu
3. **If Email is New (First Time)**:
   - Show registration form:
   - Full Name (Team Leader)
   - Team Name
   - Number of Team Members (2, 3, or 4 - includes leader)
   - Year of Study (dropdown)
   - Password (min 6 characters)
3. **If team has 2-4 members** → Collect additional member info:
   - For each additional member (excluding leader):
     - Member Name
     - Member Email
     - Year of Study
4. **Success** → Session saved, redirect to home page

### Session Management
- **LocalStorage-based sessions:** No Supabase Auth needed
- **Custom authentication:** Direct database password verification
- **Session data includes:** Team ID, Team Name, All Member Details (names, emails, years)  
- **Real-time UI updates:** Login button transforms to team name when logged in
- **Team members dropdown:** Shows all team members with leader badge
- **Member details popup:** Click any member to view their full information
- **Logout functionality:** Clears session and resets UI to login button
- **Cross-tab sync:** Session changes reflected across browser tabs

### Team Structure
- **Maximum team size:** 4 members (including team leader)
- **Minimum team size:** 2 members
- **Team leader:** First person who creates the team (Member 1)
- **Additional members:** Member 2, Member 3, Member 4 (can be null)
- **Database structure:** Single row per team with individual columns for each member:
  - `team_id`, `team_name`, `password` (team-level data)
  - `leader_name`, `leader_email`, `leader_year` (Team Leader - always filled)
  - `member2_name`, `member2_email`, `member2_year` (can be null)
  - `member3_name`, `member3_email`, `member3_year` (can be null)
  - `member4_name`, `member4_email`, `member4_year` (can be null)
- **Data submission:** All data is collected during registration and submitted to database ONLY after all team member forms are completed

## 🎨 Features

- ✨ Same purple glass-morphism design as home page
- 🔄 Smooth animated transitions between steps
- 🔐 **Custom authentication system (no Supabase Auth)**
- 📧 Email validation and existing user detection
- 🔑 Direct database password verification
- 💾 LocalStorage session management
- 👤 **Dynamic profile button:** Shows "Login" or team name based on authentication state
- 👥 **Team members dropdown:** View all team members at a glance with leader badge
- 📱 **Member details popup:** Beautiful modal showing full member information (name, email, year, team)
- 🎯 **Interactive UI:** Click any member name to view their complete profile
- 🚪 Quick logout functionality
- 📊 Session persistence across page reloads
- 🔄 Real-time session updates across components
- ✅ Success/error messages
- 📱 Fully responsive
- ♿ Reduced motion support
- 💾 Wide table design with individual columns for each of 4 team members
- ⚡ Batch data submission (all data pushed after all forms completed)
- 👑 First person registering is automatically set as team leader

## 🐛 Troubleshooting

### "Invalid API key" error
- Make sure you copied the **anon/public** key (not the service role key)
- Check for extra spaces in `.env.local`

### "Table 'teams' does not exist"
- Run the SQL from step 4 to create the `teams` table
- Make sure you're using the updated SQL schema (wide table with password column)

### "Invalid password" error
- Passwords are stored as plain text in the database for this custom auth system
- Make sure you're entering the exact password used during registration
- Check the database to verify the stored password if needed

### Login button not changing to team name
- Make sure session data is being saved (check browser localStorage)
- Try refreshing the page
- Check browser console for any errors
- Ensure both login and registration are dispatching the 'sessionUpdate' event

### Session lost after page refresh
- Verify localStorage is enabled in your browser
- Check if localStorage.setItem is working properly
- Look for any errors in the browser console

### Changes not reflecting
- Restart your dev server after updating `.env.local`
- Clear your browser cache and localStorage
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

## 📚 Additional Resources
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

