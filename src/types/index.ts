export interface User {
  email: string;
  name?: string;
}

// Update the TimeEntry interface to match the form data from MongoDB backend
export interface TimeEntry {
  id: string;
  customerName: string; // Changed from clientName
  photo: string;
  meetingStartDate: string;
  meetingStartTimestamp: string;
  location: string; // Changed from LocationData | null to string
  address: string;
  source: string; // Changed from referredBy
  phoneNumber: string;
  loanExpected: string;
  product: string; // Changed from meetingPurpose
  status: string; // Changed from clientRemarks
  remark2: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}
