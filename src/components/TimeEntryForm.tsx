import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Save, Loader, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have this context
import { LocationData } from '../types';
import 'leaflet/dist/leaflet.css'; // Keep leaflet CSS if using its utility functions for location, even if map is removed.
import Toast from './Toast';


const TimeEntryForm: React.FC = () => {
  const { user, token } = useAuth();

  const getInitialFormData = () => ({
    customerName: '',
    photo: '',
    meetingStartDate: '', // Will store formatted date (e.g., 18 May 25)
    meetingStartTimestamp: '', // Will store full timestamp for backend
    location: '', // Changed to string
    customerAddress: '', // Renamed from address
    source: '',
    phoneNumber: '',
    loanExpected: '',
    product: '',
    status: '',
    remark2: ''
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showSourceNameInput, setShowSourceNameInput] = useState(false);
  const [showStatusOtherInput, setShowStatusOtherInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "source") {
      setShowSourceNameInput(value === "Other");
      setFormData(prev => ({
        ...prev,
        source: value === "Other" ? "" : value, // If 'Other' is selected, clear source to allow manual input
      }));
    } else if (name === "sourceName") { // This handles the actual input for "Other" source
      setFormData(prev => ({
        ...prev,
        source: value, // Store the typed value directly in 'source'
      }));
    } else if (name === "status") {
      setShowStatusOtherInput(value === "Other");
      setFormData(prev => ({
        ...prev,
        status: value === "Other" ? "" : value, // If 'Other' is selected, clear status to allow manual input
      }));
    } else if (name === "otherStatus") { // This handles the actual input for "Other" status
      setFormData(prev => ({
        ...prev,
        status: value, // Store the typed value directly in 'status'
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // --- Location Functions ---
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setToast({ message: 'Geolocation is not supported by your browser.', type: 'error' });
      return;
    }
    setGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // IMPORTANT: You must replace this with your actual API key.
      const apiKey = '9f95487a9f224fb0b0ca2b4b10e3113b'; 
      // Fetch address using the API key
      let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`; // Default to coordinates
      if (apiKey === '9f95487a9f224fb0b0ca2b4b10e3113b') { // Only fetch if a real API key is provided
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.results?.[0]?.formatted) {
            address = data.results[0].formatted;
          }
        }
      }

      setFormData(prev => ({
        ...prev,
        location: address // Store full address string from API directly
      }));
    } catch (error) {
      console.error("Error getting location:", error);
      setToast({ message: 'Could not get location. Please ensure location services are enabled and permissions are granted.', type: 'error' });
    } finally {
      setGettingLocation(false);
    }
  }, []); // Empty dependency array means this function is created once

  // Run location fetch on component mount and set initial dates
  useEffect(() => {
    getCurrentLocation();

    // Set initial meeting start date to current date in "DD Mon YY" format
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
    
    const day = istDate.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[istDate.getMonth()];
    const year = istDate.getFullYear().toString().slice(-2); // Get last two digits of year
    const formattedDate = `${day} ${month} ${year}`;

    const fullTimestamp = istDate.toISOString(); // ISO string for backend

    setFormData(prev => ({
      ...prev,
      meetingStartDate: formattedDate,
      meetingStartTimestamp: fullTimestamp,
    }));

  }, [getCurrentLocation]);

  // --- Camera Functions ---
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setToast({ message: 'Camera is not supported by your browser.', type: 'error' });
      return;
    }
    setShowCamera(true); // Show modal first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setToast({ message: 'Camera access was denied or is not available. Please check your browser settings.', type: 'error' });
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const dataURL = canvasRef.current.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, photo: dataURL }));
        
        stopCamera();
      }
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  // --- File Upload Functions ---
  // Removed unused handleFileUpload and triggerFileUpload

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  

  // --- Backend Submission Function ---
  const submitToBackend = async (payload: any) => {
    try {
      console.log(payload);
      const response = await fetch("http://18.188.184.213:8040/meetings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include the token in the header
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save meeting");
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { // Check for token instead of user object
      setToast({ message: "You must be logged in to submit an entry.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare payload for backend
      const payload = {
        // userId is no longer sent from frontend; backend derives user from token
        customerName: formData.customerName,
        photo: formData.photo,
        meetingStartDate: formData.meetingStartDate,
        meetingStartTimestamp: formData.meetingStartTimestamp,
        location: formData.location && formData.customerAddress
          ? `${formData.location} . ${formData.customerAddress}`
          : formData.location || formData.customerAddress || "",
        address: formData.customerAddress,
        source: formData.source,
        phoneNumber: formData.phoneNumber,
        loanExpected: formData.loanExpected,
        product: formData.product,
        status: formData.status,
        remark2: formData.remark2
      };
      await submitToBackend(payload);
      setToast({ message: "Meeting saved to Google Sheet!", type: "success" });
      setFormData(getInitialFormData());
      getCurrentLocation();
    } catch (error: any) {
      setToast({ message: "Failed to save meeting: " + error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Removed LocationMap component as it's no longer needed

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        {showCamera && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[1100]"></div>
            {/* Modal */}
            <div className="relative z-[1110] bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 flex flex-col items-center w-full max-w-md mx-auto animate-fadeIn">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-72 object-cover rounded-xl border border-gray-300 shadow-lg mb-6 bg-black"
                style={{ background: '#222' }}
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              <div className="flex gap-4 w-full">
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3 rounded-lg font-semibold text-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 rounded-lg font-semibold text-lg bg-red-600 text-white shadow hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Customer Meeting Form</h1>
            <p className="text-gray-500">Record your session details below.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name <span className="text-red-500">*</span></label> {/* Changed label */}
                <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter customer's name" required />
              </div>


              <div>
                <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label> {/* Changed label */}
                <input
                  type="text"
                  id="customerAddress"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter customer address manually if needed"
                />
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select id="source" name="source" value={formData.source === "" && showSourceNameInput ? "Other" : formData.source} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Source</option>
                  <option value="TeleCaller">TeleCaller</option>
                  <option value="OutSource">OutSource</option>
                  <option value="Other">Other</option>
                </select>
                {showSourceNameInput && (
                  <div className="mt-4">
                    <label htmlFor="sourceName" className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
                    <input type="text" id="sourceName" name="sourceName" value={formData.source} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter source name" required />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label> {/* New field */}
                <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter phone number" />
              </div>

              <div>
                <label htmlFor="loanExpected" className="block text-sm font-medium text-gray-700 mb-1">Loan Expected</label> {/* New field */}
                <input type="text" id="loanExpected" name="loanExpected" value={formData.loanExpected} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter expected loan amount" />
              </div>

              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Product</label> {/* Changed label */}
                <select id="product" name="product" value={formData.product} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Product Type</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Lap Loan">Lap Loan</option>
                  <option value="Business Loan">Business Loan</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select id="status" name="status" value={formData.status === "" && showStatusOtherInput ? "Other" : formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Status</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Login">Login</option>
                  <option value="Discussion">Discussion</option>
                  <option value="Fraud meeting">Fraud meeting</option>
                  <option value="For not pick">For not pick</option>
                  <option value="Meeting with customer">Meeting with customer</option>
                  <option value="Other">Other</option>
                </select>
                {showStatusOtherInput && (
                  <div className="mt-4">
                    <label htmlFor="otherStatus" className="block text-sm font-medium text-gray-700 mb-1">Other Status</label>
                    <input type="text" id="otherStatus" name="otherStatus" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter other status" required />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="remark2" className="block text-sm font-medium text-gray-700 mb-1">Remark2</label>
                <textarea id="remark2" name="remark2" value={formData.remark2} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Additional remarks"></textarea>
              </div>

              {/* Photo of Visit field moved to the bottom and conditionally rendered */}
              {(formData.source === "OutSource" || formData.source === "Other") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo of Visit</label>
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                    {!formData.photo && (
                      <div className="space-y-3">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={startCamera}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 flex items-center gap-2"
                          >
                            <Camera size={16} /> Capture Photo
                          </button>
                        </div>
                      </div>
                    )}
                    {formData.photo && (
                      <div className="relative inline-block mt-2">
                        <img src={formData.photo} alt="Visit" className="max-w-xs w-full mx-auto rounded-md shadow-sm" />
                        <button type="button" onClick={removePhoto} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"><X size={18} /></button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button type="submit" disabled={isSubmitting || !formData.customerName || !formData.meetingStartDate} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <><Loader className="w-6 h-6 animate-spin" /> Submitting...</> : <><Save className="w-6 h-6" /> Submit Entry</>}
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Your entry will be saved and submitted to Google Sheets.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default TimeEntryForm;
