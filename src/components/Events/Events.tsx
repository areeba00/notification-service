/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import apiClient from "../../apiService/api-client";
import TabBar from "../../common/TabBar/TabBar";
import AddDialog from "../../common/AddDialog/AddDialog";
import CommonGrid from "../../common/Grid/CommonGrid";
import Notifications from "../Notifications/Notifications";
import CircularProgress from "@mui/material/CircularProgress"; // Adjust the import path if needed
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { TablePagination } from "@mui/material";

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
  const [originalEvents, setOriginalEvents] = useState<Events[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);

  const handleIsActiveFilterClick = () => {
    // Toggle the isActiveFilter state when the button is clicked
    setIsActiveFilter(!isActiveFilter);

    // Construct the API URL based on the isActiveFilter value and applicationId
    const apiUrl = `/events?application_id=${applicationId}&isActive=${isActiveFilter}`;

    // Send the API request using your API client
    apiClient
      .get(apiUrl)
      .then((response) => {
        // Handle the response and update your applications state accordingly
        const activeEvents = response.data.events;
        setOriginalEvents(activeEvents);
        setEvents(activeEvents);
        setTotalCount(response.data.TotalCount);
      })
      .catch((error) => {
        console.error("Error fetching filtered events:", error);
      });
  };

  // Fetch events when the selected application ID changes
  useEffect(() => {
    setIsLoading(true);

    if (applicationId !== null) {
      // Calculate the offset based on the current page and rowsPerPage
      const offset = page * rowsPerPage;
      apiClient
        .get<ApiResponse>(
          `/events?application_id=${applicationId}&page=${
            page + 1
          }&limit=${rowsPerPage}`
        )
        .then((response) => {
          const eventsData = response.data.events;
          setOriginalEvents(eventsData); // Store original events
          setEvents(eventsData);
          setTotalCount(response.data.TotalCount);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setEvents([]);
      setIsLoading(false);
      setTotalCount("");
    }
  }, [applicationId, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset the page to 0 when changing rows per page
  };

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
      .patch(`/events/${updatedEvent.id}`, updatedEventData)
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

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    // Reset the form data to empty fields
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleAddEvent = (newEvent: { name: string; description: string }) => {
    const eventDataWithAppId = {
      ...newEvent,
      application_id: applicationId,
    };
    // Make a POST request to add the new application
    apiClient
      .post("/events", eventDataWithAppId)
      .then((response) => {
        // Assuming the server returns the added application data
        const addedEvent = response.data;
        setEvents([...events, addedEvent]);
        handleCloseAddDialog();
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });
  };

  // Step 2: Handle checkbox click
  const handleCheckboxClick = (eventId: number) => {
    setSelectedEventId(eventId); // Update the selected event ID state
  };

  // filtering events
  function filterEventsByName(searchString: string): Events[] {
    if (searchString) {
      const filteredEvents = events.filter((event) => {
        const name = event.name.toLowerCase();
        return name.includes(searchString.toLowerCase());
      });
      setEvents(filteredEvents);
    } else {
      setEvents(originalEvents);
    }

    return events;
  }

  return (
    <>
      <TabBar
        title={"Events"}
        onAddClick={handleAddClick}
        submitFunction={filterEventsByName}
        totalCount={totalCount}
        onIsActiveFilterClick={handleIsActiveFilterClick}
      />
      {isLoading && (
        <CircularProgress /> // Show loading indicator while fetching data
      )}
      {applicationId === null && (
        <Alert severity="info" className="my-Alerts">
          <AlertTitle>Info</AlertTitle>
          No Events to show — <strong>Kindly select an application!</strong>
        </Alert>
      )}
      {applicationId !== null && events.length === 0 ? (
        <Alert severity="warning" className="my-Alerts">
          <AlertTitle>Failed</AlertTitle>
          No events found —{" "}
          <strong>This Application has no corresponding events!</strong>
        </Alert>
      ) : (
        applicationId != null &&
        !isLoading && (
          <>
            <CommonGrid
              items={events}
              deleteHandler={deleteEvent}
              editHandler={editEvent}
              itemType="event"
              onCheckboxClick={handleCheckboxClick}
            />
            <TablePagination
              component="div"
              count={parseInt(totalCount)}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <AddDialog
              open={isAddDialogOpen}
              onClose={handleCloseAddDialog}
              formData={formData}
              handleInputChange={handleInputChange}
              handleAdd={handleAddEvent}
              title="Add Event"
            />
            <Notifications eventId={selectedEventId} />
          </>
        )
      )}
    </>
  );
};

export default Events;
