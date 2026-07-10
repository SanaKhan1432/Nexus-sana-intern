import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Check, X, Clock, Calendar as CalendarIcon, User } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

// TypeScript Definitions for our mock data
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Meeting {
  id: string;
  name: string;
  role: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed';
}

export default function MeetingCalendar() {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Mock Data: Available Time Slots
  const availableSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];

  // Mock Data: Meetings State
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Investor',
      date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
      time: '10:00 AM',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'Angel Investor',
      date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
      time: '02:00 PM',
      status: 'pending'
    },
    {
      id: '3',
      name: 'David Kim',
      role: 'Venture Capitalist',
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // 1 day from now
      time: '11:30 AM',
      status: 'confirmed'
    }
  ]);

  // --- Handlers ---

  const handleDateChange = (newDate: Value) => {
    setDate(newDate);
    setSelectedSlot(null); // Reset slot when new date is picked
  };

  const handleAccept = (id: string) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, status: 'confirmed' } : m));
  };

  const handleDecline = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const handleSendRequest = () => {
    if (!selectedSlot || !date) return;
    
    const newRequest: Meeting = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Investor',
      role: 'Venture Capitalist',
      date: date as Date,
      time: selectedSlot,
      status: 'pending'
    };
    
    setMeetings([...meetings, newRequest]);
    setSelectedSlot(null);
    alert('Meeting request sent successfully!');
  };

  // --- Derived State ---
  const pendingRequests = meetings.filter(m => m.status === 'pending');
  const confirmedMeetings = meetings.filter(m => m.status === 'confirmed');

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* SECTION 1: Calendar & Slot Selection */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
          <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
          Schedule & Availability
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar Widget */}
          <div className="p-2 bg-primary-50 rounded-xl">
            <Calendar 
              onChange={handleDateChange} 
              value={date}
              minDate={new Date()}
              prev2Label={null}
              next2Label={null}
              className="border-none w-full bg-transparent font-sans"
            />
          </div>

          {/* Time Slots Widget */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Available Slots for {(date as Date)?.toLocaleDateString()}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 text-sm font-medium rounded-lg transition-all border ${
                    selectedSlot === slot 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleSendRequest}
              disabled={!selectedSlot}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedSlot 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send Meeting Request
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Pending Requests */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Pending Requests ({pendingRequests.length})
        </h3>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No pending requests at the moment.</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <User className="w-4 h-4 text-primary-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{req.name}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {req.date.toLocaleDateString()}
                      <Clock className="w-3 h-3 ml-2 mr-1" />
                      {req.time}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleAccept(req.id)}
                    className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                    title="Accept"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDecline(req.id)}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    title="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Confirmed Meetings */}
      <div className="p-6 bg-white">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Confirmed Meetings ({confirmedMeetings.length})
        </h3>
        {confirmedMeetings.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No confirmed meetings yet.</p>
        ) : (
          <div className="space-y-3">
            {confirmedMeetings.map(meeting => (
              <div key={meeting.id} className="flex items-center p-3 border-l-4 border-primary-500 bg-primary-50 rounded-r-lg shadow-sm">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{meeting.name}</p>
                  <p className="text-xs text-primary-700 font-medium">{meeting.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-900">
                    {meeting.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-primary-700">{meeting.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}