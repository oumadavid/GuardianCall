// services/smsService.js (updated)
const API_BASE_URL = 'http://localhost:3000';

export const smsService = {
  // Send SMS with alert details to rangers/poachers
  sendAlertSMS: async (phoneNumber, alertDetails, messageType = 'ranger') => {
    try {
      // Different message templates for rangers vs poachers
      let message;
      
      if (messageType === 'poacher') {
        // Message for poachers (warning/deterrent)
        message = `🚨 WARNING: ILLEGAL ACTIVITY DETECTED 🚨

This is the Kenya Wildlife Service. 
We have detected ${alertDetails.type} activity at ${alertDetails.location}.

Our rangers have been dispatched to your location. 
Cease all activities immediately and await instructions.

Legal consequences will follow for continued illegal activities.`;
      } else {
        // Message for rangers (alert notification)
        message = `🚨 GUARDIANCALL ALERT 🚨
Type: ${alertDetails.type}
Location: ${alertDetails.location}
Coordinates: ${alertDetails.coordinates?.lat || 'N/A'}, ${alertDetails.coordinates?.lng || 'N/A'}
Time: ${new Date(alertDetails.timestamp).toLocaleString()}
Severity: ${alertDetails.severity?.toUpperCase() || 'HIGH'}
Confidence: ${alertDetails.confidence || 'N/A'}%

URGENT: Please investigate immediately.`;
      }

      const response = await fetch(`${API_BASE_URL}/api/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          message: message,
          alertDetails: alertDetails
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send SMS');
      }

      return await response.json();
    } catch (error) {
      console.error('SMS Service Error:', error);
      throw error;
    }
  },

  // Send SMS to multiple recipients
  sendBulkAlertSMS: async (phoneNumbers, alertDetails, messageType = 'ranger') => {
    const results = [];
    
    for (const phoneNumber of phoneNumbers) {
      try {
        const result = await smsService.sendAlertSMS(phoneNumber, alertDetails, messageType);
        results.push({ phoneNumber, status: 'success', result });
      } catch (error) {
        results.push({ phoneNumber, status: 'error', error: error.message });
      }
    }
    
    return results;
  },

  // Send warning message to suspected poachers
  sendPoacherWarning: async (phoneNumber, alertDetails) => {
    return await smsService.sendAlertSMS(phoneNumber, alertDetails, 'poacher');
  }
};