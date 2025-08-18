# Time Tracking App with Google Sheets Integration

A comprehensive React application for time tracking with photo capture, location tracking, and Google Sheets integration.

## Features

### Authentication
- User registration and login system
- Secure session management
- Protected routes

### Time Entry Form
- **Client Name**: Input field for client information
- **Photo Capture**: 
  - Take photos using device camera
  - Upload photos from device
  - Display captured images
- **Time Tracking**:
  - Record in-time with current timestamp
  - Record out-time with current timestamp
- **Location Tracking**:
  - GPS location capture
  - Address resolution
  - Interactive map display
- **Data Submission**: Save all data including images to Google Sheets

### History Management
- View all previous time entries
- Filter entries by user
- Update out-time for incomplete entries
- Visual display of photos and location data

### User Interface
- Responsive design for all devices
- Compact sidebar navigation
- Modern, clean interface
- Smooth animations and transitions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API
- **Camera**: MediaDevices API
- **Location**: Geolocation API
- **Maps**: Custom map component (ready for Google Maps integration)

## Google Sheets Integration

The app is designed to integrate with Google Sheets API for data storage. To set up Google Sheets integration:

1. Create a Google Cloud Console project
2. Enable the Google Sheets API
3. Create service account credentials
4. Share your Google Sheet with the service account email
5. Update the `submitToGoogleSheets` function in `TimeEntryForm.tsx` with your API credentials

### Data Structure

The following data is sent to Google Sheets:
- Date
- Client Name
- In Time
- Out Time
- Location (address)
- Photo availability indicator
- Images (can be uploaded to Google Drive and linked)

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the app at `http://localhost:5173`

## Usage

1. **Sign Up/Login**: Create an account or log in
2. **Fill Time Entry Form**:
   - Enter client name
   - Take or upload a photo
   - Record in-time when starting work
   - Get current location
   - Record out-time when finishing work
   - Submit the form
3. **View History**: Access previous entries and update missing out-times

## Camera Permissions

The app requires camera permissions for photo capture. Ensure your browser allows camera access for the best experience.

## Location Permissions

Location tracking requires GPS permissions. The app will request access when you click "Get Current Location".

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Features

- Client-side data validation
- Secure authentication flow
- Protected routes
- Local storage for session management

## Future Enhancements

- Offline support with data sync
- Advanced reporting and analytics
- Team management features
- Export capabilities (PDF, CSV)
- Push notifications for time tracking reminders