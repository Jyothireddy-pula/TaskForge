# OAuth Authentication System Setup Guide

## Overview
This guide walks you through setting up a complete full-stack authentication system using JWT and OAuth with Google login functionality.

## Features Implemented
- ✅ Google OAuth 2.0 authentication
- ✅ JWT token generation and verification
- ✅ Protected routes with middleware
- ✅ Token expiration handling
- ✅ User profile management
- ✅ Secure session management
- ✅ Protected dashboard with user info display

## Folder Structure

```
NexusFlow/
├── backend/
│   ├── config/
│   │   └── passport.js          # Passport configuration for Google OAuth
│   ├── middleware/              # (existing)
│   ├── models/
│   │   └── User.js             # Updated with OAuth fields
│   ├── routes/
│   │   └── auth.js             # OAuth routes and JWT handling
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js               # Express server with Passport setup
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AuthPanel.jsx   # Login form with Google button
│   │   ├── pages/
│   │   │   ├── AuthCallback.jsx # OAuth callback handler
│   │   │   └── Dashboard.jsx   # Protected dashboard with user info
│   │   ├── services/
│   │   │   └── authService.js  # API calls and OAuth functions
│   │   └── App.jsx             # Main app with routing
│   └── package.json
└── OAUTH_SETUP_GUIDE.md        # This file
```

## Setup Instructions

### 1. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:5000/api/auth/google/callback`
5. Copy **Client ID** and **Client Secret**

### 2. Backend Setup

1. **Install dependencies** (already done):
   ```bash
   cd backend
   npm install passport passport-google-oauth20 express-session
   ```

2. **Configure environment variables** in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://jyothireddypula_db_user:Michaelvit@cluster0.hj2svno.mongodb.net/taskforge?retryWrites=true&w=majority
   JWT_SECRET=taskforge_secret
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

### 3. Frontend Setup

1. **Install dependencies** (already done):
   ```bash
   cd frontend
   npm install react-router-dom
   ```

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

## API Endpoints

### Authentication Routes
- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles Google OAuth callback
- `POST /api/auth/signup` - Local user registration
- `POST /api/auth/login` - Local user login
- `GET /api/auth/me` - Get current user info (protected)

### Request/Response Examples

#### Google OAuth Flow
1. **Initiate OAuth**:
   ```
   GET /api/auth/google
   -> Redirects to Google OAuth page
   ```

2. **OAuth Callback**:
   ```
   GET /api/auth/google/callback?code=...
   -> Redirects to frontend with JWT token
   -> http://localhost:5173/auth/callback?token=eyJhbGciOiJIUzI1NiIs...
   ```

3. **Get User Info**:
   ```javascript
   GET /api/auth/me
   Headers: Authorization: Bearer <token>
   
   Response:
   {
     "user": {
       "id": "64f8a1b2c3d4e5f6a7b8c9d0",
       "name": "John Doe",
       "email": "john.doe@gmail.com",
       "avatar": "https://lh3.googleusercontent.com/...",
       "provider": "google"
     }
   }
   ```

## Database Schema

### User Model (MongoDB)
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (conditional - not required for OAuth users),
  googleId: String (unique, sparse),
  avatar: String,
  provider: String (enum: ['local', 'google'], default: 'local'),
  createdAt: Date (default: Date.now)
}
```

## Security Features

### JWT Configuration
- **Token Expiry**: 1 hour for OAuth, 7 days for local auth
- **Algorithm**: HS256
- **Payload**: User ID and email

### Token Storage
- **Backend**: HTTP-only session cookies
- **Frontend**: localStorage (for demo - use HTTP-only cookies in production)

### Security Headers
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Rate limiting on auth endpoints

## Frontend Components

### AuthPanel.jsx
- Login/Signup forms
- Google OAuth button with official Google branding
- Form validation and error handling

### AuthCallback.jsx
- Handles OAuth callback from Google
- Stores JWT token and user data
- Redirects to dashboard

### Dashboard.jsx
- Protected route requiring valid JWT
- Displays user information (name, email, avatar, provider)
- Token expiration checking

## Token Expiration Handling

### Backend
- JWT tokens include `exp` claim
- Middleware verifies token validity
- Returns 401 for expired tokens

### Frontend
- Automatic token expiration checking every minute
- User-friendly logout on expiration
- Redirects to login page

## Development vs Production

### Development
- `http://localhost:5000` (backend)
- `http://localhost:5173` (frontend)
- Session cookies: `secure: false`

### Production Changes Needed
1. **Environment Variables**:
   - Update `CLIENT_ORIGIN` to production URL
   - Set `NODE_ENV=production`
   - Use production MongoDB URI

2. **Security**:
   - Enable HTTPS
   - Set session `secure: true`
   - Use HTTP-only cookies for JWT storage
   - Update Google OAuth redirect URI

3. **Google OAuth**:
   - Add production domain to authorized origins
   - Update redirect URI to production URL

## Testing the System

### 1. Local Authentication
- Navigate to `http://localhost:5173`
- Click "Sign up" and create a local account
- Verify login functionality

### 2. Google OAuth
- Click "Continue with Google"
- Complete Google authentication
- Verify redirect to dashboard with user info

### 3. Protected Routes
- Access dashboard without authentication (should redirect)
- Test token expiration (wait 1 hour or modify expiry)
- Verify logout functionality

## Troubleshooting

### Common Issues

1. **Google OAuth Redirect Error**:
   - Check redirect URI in Google Console matches backend URL
   - Verify `CLIENT_ORIGIN` in .env file

2. **CORS Issues**:
   - Ensure frontend URL matches `CLIENT_ORIGIN`
   - Check CORS configuration in server.js

3. **Database Connection**:
   - Verify MongoDB URI is correct
   - Check network connectivity

4. **Token Issues**:
   - Verify `JWT_SECRET` matches between frontend and backend
   - Check token expiration logic

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=passport:* npm run dev
```

## Next Steps

### Production Deployment
1. Set up production database
2. Configure production OAuth credentials
3. Enable HTTPS
4. Set up environment variables
5. Deploy to hosting provider

### Additional Features
- Password reset functionality
- Email verification
- Two-factor authentication
- Social login providers (Facebook, GitHub)
- User profile management
- Role-based access control

## Support

For issues with this authentication system:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure Google OAuth credentials are properly configured
4. Check browser console for JavaScript errors
5. Review server logs for backend errors
