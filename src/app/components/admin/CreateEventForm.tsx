"use client"
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../useAuth';

interface CreateEventFormProps {
  onEventCreated?: () => void;
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const { user } = useAuth();
  const [eventName, setEventName] = useState('');
  const [eventDriveUrl, setEventDriveUrl] = useState('');
  const [eventThumbnail, setEventThumbnail] = useState<File | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [eventHour, setEventHour] = useState('');
  const [eventMinute, setEventMinute] = useState('');
  const [eventError, setEventError] = useState('');
  const [eventSuccess, setEventSuccess] = useState('');

  const handleEventThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEventThumbnail(e.target.files[0]);
    }
  };

  const convertToWebP = (file: File, quality: number = 0.8, maxWidth: number = 800, maxHeight: number = 600): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = Math.min(width, maxWidth);
            height = width / aspectRatio;
          } else {
            height = Math.min(height, maxHeight);
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image to WebP'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCreateEvent = async (event: FormEvent) => {
    event.preventDefault();
    setEventError('');
    setEventSuccess('');

    if (!eventThumbnail || !eventName || !eventDriveUrl || !eventDate || !eventHour || !eventMinute) {
      setEventError('Please fill in all fields and select a thumbnail image.');
      return;
    }

    try {
      const webpBlob = await convertToWebP(eventThumbnail);
      
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(webpBlob);
      });

      const eventDateTime = new Date(`${eventDate}T${eventHour.padStart(2, '0')}:${eventMinute.padStart(2, '0')}`);

      if (!user) {
        setEventError('User not authenticated');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: eventName,
          driveUrl: eventDriveUrl,
          thumbnailData: base64Data,
          thumbnailFileName: eventThumbnail.name,
          eventDate: eventDateTime.toISOString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      setEventSuccess('Event created successfully!');
      onEventCreated?.(); // Notify parent to refresh events list

      // Clear form
      setEventName('');
      setEventDriveUrl('');
      setEventThumbnail(null);
      setEventDate('');
      setEventHour('');
      setEventMinute('');
      const fileInput = document.getElementById('eventThumbnail') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error creating event:', error);
      setEventError((error as Error).message);
    }
  };

  return (
    <div className="admin-card space-y-6">
      <form onSubmit={handleCreateEvent} className="space-y-4">
        <h1 className="admin-title">Create New Event</h1>
        <div className="space-y-2">
          <label htmlFor="eventName" className="admin-label">Event Name</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            className="admin-control"
            autoComplete="off"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="eventDriveUrl" className="admin-label">Google Drive Link</label>
          <input
            type="url"
            id="eventDriveUrl"
            value={eventDriveUrl}
            onChange={(e) => setEventDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="admin-control"
            autoComplete="off"
            required
          />
          <p className="admin-help-text">
            Make sure the folder is set to "Anyone with the link can view"
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="eventDate" className="admin-label">Event Date</label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="admin-control"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="admin-label">Event Time</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="admin-help-text block mb-1">Hour</label>
              <select
                value={eventHour}
                onChange={(e) => setEventHour(e.target.value)}
                className="admin-control"
                required
              >
                <option value="">Hour</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i.toString().padStart(2, '0')}>
                    {i.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-help-text block mb-1">Minute</label>
              <select
                value={eventMinute}
                onChange={(e) => setEventMinute(e.target.value)}
                className="admin-control"
                required
              >
                <option value="">Minute</option>
                {['00', '15', '30', '45'].map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="eventThumbnail" className="admin-label">Thumbnail Image</label>
          <input
            type="file"
            id="eventThumbnail"
            onChange={handleEventThumbnailChange}
            accept="image/*"
            className="admin-control"
            required
          />
        </div>

        <button
          type="submit"
          className="admin-button-success-full"
        >
          Create Event
        </button>

        {eventError && <p className="text-red-500">{eventError}</p>}
        {eventSuccess && <p className="text-green-500">{eventSuccess}</p>}
      </form>
    </div>
  );
}
