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
  console.log("Props:", applicationId);
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
      // Clear events when no application is selected
      setEvents([]);
    }
  }, [applicationId]);
  return (
    <div>
      {/* Render the events */}
      {/* {events.map((event) => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <p>{event.description}</p>
        </div>
      ))} */}

      {/* Render the Grid component and pass the events as props */}
      <Grid events={events} />
    </div>
  );
};

export default Events;
