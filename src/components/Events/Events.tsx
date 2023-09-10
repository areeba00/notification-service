/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import apiClient from "../../apiService/api-client";
import Grid from "../../common/Grid/Grid";
// ... other imports ...

interface Events {
  id: number;
  name: string;
  description: string;
  application_id: number;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface ApiResponse {
  TotalCount: string;
  events: Events[];
}
interface EventsProps {
  applicationId: number | null; // Selected application ID
}

const Events = ({ applicationId }: EventsProps) => {
  const [events, setEvents] = useState<Events[]>([]);

  // Fetch events when the selected application ID changes
  useEffect(() => {
    if (applicationId !== null) {
      // Fetch events using the selected application ID
      apiClient
        .get<ApiResponse>(`/events?application_id=${applicationId}`)
        .then((response) => {
          console.log("Fetched events:", response.data.events);
          setEvents(response.data.events);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    } else {
      apiClient
        .get<ApiResponse>("/events")
        .then((response) => {
          console.log("Fetched all events:", response.data.events);
          setEvents(response.data.events);
        })
        .catch((error) => {
          console.error("Error fetching all events:", error);
        });
    }
  }, [applicationId]);

  const deleteEvent = (event: Events) => {
    // Create a new array that filters out the event to be deleted
    const updatedEvents = events.filter((ev) => ev.id !== event.id);

    // Update the state with the new array
    setEvents(updatedEvents);

    apiClient
      .delete("/events/" + event.id)
      .catch((err) => console.log(err.message));
  };
  const editEvent = (updatedEvent: Events) => {
    // Create an object with the updated event data
    const updatedEventData = {
      name: updatedEvent.name,
      description: updatedEvent.description,
      application_id: updatedEvent.application_id, // Include the applicationId from props
    };

    // Send a PUT request to update the event on the server
    apiClient
      .put(`/events/${updatedEvent.id}`, updatedEventData)
      .then((response) => {
        // Assuming the server returns the updated event data
        const updatedEvents = events.map((event) =>
          event.id === updatedEvent.id ? response.data : event
        );
        setEvents(updatedEvents);
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  return (
    <>
      {events.map((event) => (
        <Grid
          events={event}
          deleteHandler={deleteEvent}
          editHandler={editEvent}
        />
      ))}
    </>
  );
};

export default Events;
