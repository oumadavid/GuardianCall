// components/SmsModal/SmsModal.jsx (updated)
import React, { useState } from 'react';
import { smsService } from '../../services/smsServices';
import './SMSModal.css';

function SMSModal({ alert, isOpen, onClose, rangers }) {
  const [selectedRangers, setSelectedRangers] = useState([]);
  const [selectedPoachers, setSelectedPoachers] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  const [messageType, setMessageType] = useState('ranger'); // 'ranger' or 'poacher'
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState([]);

  // Default rangers list
  const defaultRangers = [
    { id: 1, name: 'James Kariuki', phone: '+254702683413', team: 'Alpha' },
    { id: 2, name: 'Sarah Mwende', phone: '+254723456789', team: 'Bravo' },
    { id: 3, name: 'Mike Otieno', phone: '+254734567890', team: 'Charlie' }
  ];

  // Sample poacher phone numbers (in real app, this might come from intelligence data)
  const poacherContacts = [
    { id: 'p1', name: 'Suspected Poacher 1', phone: '+254700000001', location: 'Sector 12' },
    { id: 'p2', name: 'Suspected Poacher 2', phone: '+254700000002', location: 'North Boundary' },
    { id: 'p3', name: 'Known Poacher Group', phone: '+254700000003', location: 'Near River' }
  ];

  const rangerList = rangers || defaultRangers;

  // Message templates
  const messageTemplates = {
    ranger: `🚨 GUARDIANCALL ALERT 🚨
Type: ${alert?.type || 'Gunshot'}
Location: ${alert?.location || 'Unknown'}
Coordinates: ${alert?.coordinates ? `${alert.coordinates.lat}, ${alert.coordinates.lng}` : 'N/A'}
Time: ${alert?.timestamp ? new Date(alert.timestamp).toLocaleString() : new Date().toLocaleString()}
Severity: ${alert?.severity?.toUpperCase() || 'HIGH'}
Confidence: ${alert?.confidence || 'N/A'}%

URGENT: Please investigate immediately.`,

    poacher: `🚨 WARNING: ILLEGAL ACTIVITY DETECTED 🚨

This is the Kenya Wildlife Service. 
We have detected ${alert?.type || 'suspicious'} activity at ${alert?.location || 'your location'}.

Our rangers have been dispatched. 
Cease all activities immediately and await instructions.

Legal consequences will follow for continued illegal activities.`
  };

  const handleSendSMS = async () => {
    const recipients = messageType === 'ranger' ? selectedRangers : selectedPoachers;
    
    if (recipients.length === 0) {
      alert(`Please select at least one ${messageType}`);
      return;
    }

    setIsSending(true);
    setSendResults([]);

    const recipientData = messageType === 'ranger' 
      ? rangerList.filter(r => recipients.includes(r.id))
      : poacherContacts.filter(p => recipients.includes(p.id));

    const results = [];

    for (const recipient of recipientData) {
      try {
        const result = messageType === 'ranger'
          ? await smsService.sendAlertSMS(recipient.phone, alert, 'ranger')
          : await smsService.sendPoacherWarning(recipient.phone, alert);

        results.push({ 
          name: recipient.name, 
          phone: recipient.phone,
          type: messageType,
          status: 'success', 
          result 
        });
      } catch (error) {
        results.push({ 
          name: recipient.name, 
          phone: recipient.phone,
          type: messageType,
          status: 'error', 
          error: error.message 
        });
      }
    }

    setSendResults(results);
    setIsSending(false);
  };

  const handleRecipientSelect = (recipientId, type) => {
    if (type === 'ranger') {
      setSelectedRangers(prev => 
        prev.includes(recipientId) 
          ? prev.filter(id => id !== recipientId)
          : [...prev, recipientId]
      );
    } else {
      setSelectedPoachers(prev =>
        prev.includes(recipientId)
          ? prev.filter(id => id !== recipientId)
          : [...prev, recipientId]
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sms-modal-overlay">
      <div className="sms-modal">
        <div className="modal-header">
          <h2>Send Alert via SMS</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Message Type Selection */}
          <div className="message-type-section">
            <h4>Recipient Type</h4>
            <div className="type-buttons">
              <button
                className={`type-button ${messageType === 'ranger' ? 'active' : ''}`}
                onClick={() => setMessageType('ranger')}
              >
                📱 Send to Rangers
              </button>
              <button
                className={`type-button ${messageType === 'poacher' ? 'active' : ''}`}
                onClick={() => setMessageType('poacher')}
              >
    ⚠️ Send to Poachers
              </button>
            </div>
          </div>

          {/* Alert Preview */}
          <div className="alert-preview">
            <h4>Alert Details</h4>
            <div className="alert-info">
              <div className="info-row">
                <span>Type:</span>
                <span>{alert?.type || 'Gunshot'}</span>
              </div>
              <div className="info-row">
                <span>Location:</span>
                <span>{alert?.location || 'Unknown'}</span>
              </div>
              <div className="info-row">
                <span>Severity:</span>
                <span className={`severity-${alert?.severity || 'high'}`}>
                  {alert?.severity?.toUpperCase() || 'HIGH'}
                </span>
              </div>
            </div>
          </div>

          {/* Message Customization */}
          <div className="message-section">
            <h4>SMS Message ({messageType === 'ranger' ? 'Ranger Alert' : 'Poacher Warning'})</h4>
            <textarea
              className="message-textarea"
              value={customMessage || messageTemplates[messageType]}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={8}
              placeholder="Enter custom message..."
            />
            <div className="message-length">
              {(customMessage || messageTemplates[messageType]).length} characters
              {(customMessage || messageTemplates[messageType]).length > 160 && (
                <span className="message-warning"> (Long message - may be split into multiple SMS)</span>
              )}
            </div>
          </div>

          {/* Recipient Selection */}
          <div className="recipients-section">
            <h4>Select {messageType === 'ranger' ? 'Rangers' : 'Poachers'}</h4>
            
            <div className="recipients-list">
              {(messageType === 'ranger' ? rangerList : poacherContacts).map(recipient => (
                <div key={recipient.id} className="recipient-item">
                  <label className="recipient-checkbox">
                    <input
                      type="checkbox"
                      checked={
                        messageType === 'ranger' 
                          ? selectedRangers.includes(recipient.id)
                          : selectedPoachers.includes(recipient.id)
                      }
                      onChange={() => handleRecipientSelect(recipient.id, messageType)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  
                  <div className="recipient-info">
                    <span className="recipient-name">{recipient.name}</span>
                    <span className="recipient-details">
                      {recipient.phone} {recipient.team && `• ${recipient.team} Team`}
                    </span>
                    {recipient.location && (
                      <span className="recipient-location">📍 {recipient.location}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Send Results */}
          {sendResults.length > 0 && (
            <div className="results-section">
              <h4>Send Results</h4>
              <div className="results-list">
                {sendResults.map((result, index) => (
                  <div key={index} className={`result-item ${result.status}`}>
                    <div className="result-info">
                      <span className="recipient-name">{result.name}</span>
                      <span className="recipient-phone">{result.phone}</span>
                      <span className="recipient-type">({result.type})</span>
                    </div>
                    <span className={`status-badge ${result.status}`}>
                      {result.status === 'success' ? '✅ Sent' : '❌ Failed'}
                    </span>
                    {result.error && (
                      <span className="error-message">{result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`send-button ${messageType}`}
            onClick={handleSendSMS}
            disabled={isSending || (messageType === 'ranger' ? selectedRangers.length === 0 : selectedPoachers.length === 0)}
          >
            {isSending ? 'Sending...' : `Send ${messageType === 'ranger' ? 'Ranger' : 'Poacher'} Alerts (${messageType === 'ranger' ? selectedRangers.length : selectedPoachers.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SMSModal;