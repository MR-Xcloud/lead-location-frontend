import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar, Image as ImageIcon, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TimeEntry } from '../types';
const HistoryPage: React.FC = () => {
  const { token } = useAuth(); // Use token from AuthContext
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!token) {
        setEntries([]);
        return;
      }
      try {
        const response = await fetch(`http://18.188.184.213:8040/meetings`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }
        const data = await response.json();
        setEntries(data.reverse());
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setEntries([]);
      }
    };

    fetchMeetings();
  }, [token]); // Depend on token

  // Removed updateOutTime function as it's no longer supported by backend

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Time Entry History</h1>
        <p className="text-gray-600 mt-2">View and manage your previous time entries</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
          <p className="text-gray-600">Your time entries will appear here after you submit them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      {entry.customerName} {/* Changed from clientName */}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      {entry.meetingStartDate} {/* Changed from date */}
                    </p>
                  </div>
                  {entry.photo && (
                    <div className="ml-4">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Start:</span>
                    <span className="text-gray-600">
                      {entry.meetingStartDate} {new Date(entry.meetingStartTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Removed End time display as it's no longer supported */}

                  {(entry.location || entry.address) && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-gray-600 text-xs">
                        {entry.location}
                        {entry.location && entry.address && <span> &middot; </span>}
                        {entry.address}
                        {!(entry.location || entry.address) && <span>Not available</span>}
                      </span>
                    </div>
                  )}
                </div>

                {/* Removed "Add Meeting End Time" button and modal */}
              </div>

              {entry.photo && (
                <div className="px-6 pb-6">
                  {entry.photo.startsWith('http://') || entry.photo.startsWith('https://') ? (
                    <iframe
                      src={`http://127.0.0.1:8000/image/${entry.id}`}
                      title="Entry photo"
                      className="w-full h-32 rounded-lg border-none"
                      style={{ background: 'transparent' }}
                    />
                  ) : (
                    <img
                      src={entry.photo}
                      alt="Entry photo"
                      className="w-full h-32 object-cover rounded-lg"
                      style={{ cursor: 'pointer' }}
                      onClick={() => window.open(entry.photo, '_blank')}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
