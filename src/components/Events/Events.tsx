/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import apiClient from "../../apiService/api-client";
import TabBar from "../../common/TabBar/TabBar";
import AddDialog from "../../common/AddDialog/AddDialog";
import CommonGrid from "../../common/Grid/CommonGrid";
import Notifications from "../Notifications/Notifications";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { TablePagination } from "@mui/material";
import { useBetween } from "use-between";
import States from "../../States";

// Define your alert types
const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};
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
  const { selectedEventId, setSelectedEventId } = useBetween(States);

  const [events, setEvents] = useState<Events[]>([]);
  const [originalEvents, setOriginalEvents] = useState<Events[]>([]);
  // const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<string | null>(null);

  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<
    "name" | "created_at" | "updated_at" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );

  const handleActiveClick = (isActive: boolean | undefined) => {
    setIsActiveFilter(isActive);
  };
  const handleSortByClick = (
    sortByValue: "name" | "created_at" | "updated_at" | undefined
  ) => {
    setSortBy(sortByValue);
  };

  const handleSortOrderClick = (sortOrderValue: "asc" | "desc" | undefined) => {
    setSortOrder(sortOrderValue);
  };
  useEffect(() => {
    // Construct the query string with optional parameters
    const queryParams = [];

    if (isActiveFilter !== undefined) {
      queryParams.push(`isActive=${isActiveFilter}`);
    }

    if (sortBy) {
      queryParams.push(`sortBy=${sortBy}`);
    }

    if (sortOrder) {
      queryParams.push(`sortOrder=${sortOrder}`);
    }

    // Join the query parameters with '&' and construct the final query string
    const queryString = queryParams.join("&");

    setIsLoading(true);

    if (applicationId !== null) {
      // Calculate the offset based on the current page and rowsPerPage
      const offset = page * rowsPerPage;
      apiClient
        .get<ApiResponse>(
          `/events?application_id=${applicationId}&page=${
            page + 1
          }&limit=${rowsPerPage}&${queryString}`
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
  }, [applicationId, page, rowsPerPage, isActiveFilter, sortBy, sortOrder]);

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
      .then(() => {
        // Check if there are no events on the current page and reset the page to 0
        if (updatedEvents.length === 0 && page > 0) {
          setPage(0);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const editEvent = async (updatedEvent: Events) => {
    // Create an object with the updated event data
    const updatedEventData = {
      name: updatedEvent.name,
      description: updatedEvent.description,
      application_id: updatedEvent.application_id, // Include the applicationId from props
      isActive: updatedEvent.isActive,
    };

    console.log("In EVENT: ", updatedEvent);

    // Send a PUT request to update the event on the server
    // apiClient
    //   .put(`/events/${updatedEvent.id}`, updatedEventData)
    //   .then((response) => {
    //     // Assuming the server returns the updated event data
    // const updatedEvents = events.map((event) =>
    //   event.id === updatedEvent.id ? response.data : event
    // );
    // setEvents(updatedEvents);
    //   })
    //   .catch((error) => {
    //     console.error("Error updating event:", error);
    //   });

    try {
      const response = await apiClient.put(
        `/events/${updatedEvent.id}`,
        updatedEventData
      );
      const updatedEvents = events.map((event) =>
        event.id === updatedEvent.id ? response.data : event
      );
      setEvents(updatedEvents);
      return "Data updated successfully!";
    } catch (error) {
      throw error.response?.data || "Error updating event. Please try again.";
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value.replace(/\s+/g, " "),
    });
    // Clear the alert message when the user starts typing
    if (name === "name" || name === "description") {
      setAlertMessage(null);
      setAlertType(null);
    }
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

    const trimmedName = eventDataWithAppId.name.trim();
    const trimmedDescription = eventDataWithAppId.description.trim();
    const newEvent2 = {
      name: trimmedName,
      description: trimmedDescription,
      application_id: applicationId,
    };

    // Make a POST request to add the new application
    apiClient
      .post("/events", newEvent2)
      .then((response) => {
        // Assuming the server returns the added application data
        const addedEvent = response.data;
        const updatedEvents = [...events, addedEvent];
        setEvents(updatedEvents);
        setAlertMessage("Data added successfully!");
        setAlertType(ALERT_TYPES.SUCCESS);
        handleCloseAddDialog();
        // Check if the new event exceeds the current page's capacity
        if (updatedEvents.length > rowsPerPage) {
          // Calculate the new page number
          const newPage = Math.floor(updatedEvents.length / rowsPerPage);
          setPage(newPage);
        }
      })
      .catch((error) => {
        console.error("Error adding event:", error);
        setAlertMessage(error.response.data);
        setAlertType(ALERT_TYPES.ERROR);
      });
  };

  useEffect(() => {
    if (!isAddDialogOpen) {
      setAlertMessage(null);
      setAlertType(null);
    }
  }, [isAddDialogOpen]);

  // const handleCheckboxClick = (eventId: number) => {
  //   setSelectedEventId(eventId); // Update the selected event ID state
  // };

  const handleCheckboxClick = (eventId: number) => {
    if (selectedEventId !== null) {
      // Handle the case when state is coming from useBetween
      if (eventId !== selectedEventId) {
        // Update the selected event ID state for a different event
        setSelectedEventId(eventId);
      } else {
        // Deselect the event if clicking the same event again
        setSelectedEventId(null);
      }
    } else {
      // Handle the case when there is no state from useBetween
      setSelectedEventId(eventId);
    }
  };

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
      {isLoading && <CircularProgress />}
      {applicationId === null && (
        <Alert severity="info" className="my-Alerts">
          <AlertTitle>Info</AlertTitle>
          No Events to show — <strong>Kindly select an application!</strong>
        </Alert>
      )}
      {applicationId !== null && events.length === 0 ? (
        <>
          <TabBar
            title={"EVENTS"}
            onAddClick={handleAddClick}
            submitFunction={filterEventsByName}
            totalCount={totalCount}
            onActiveClick={handleActiveClick}
            onSortByClick={handleSortByClick}
            onSortOrderClick={handleSortOrderClick}
          />
          <Alert severity="warning" className="my-Alerts">
            No events found —{" "}
            <strong>This Application has no corresponding events!</strong>
          </Alert>

          <AddDialog
            open={isAddDialogOpen}
            onClose={handleCloseAddDialog}
            formData={formData}
            handleInputChange={handleInputChange}
            handleAdd={handleAddEvent}
            title="Add Event"
            alertMessage={alertMessage} // Pass the alert message as a prop
            alertType={alertType}
          />
        </>
      ) : (
        applicationId != null &&
        !isLoading && (
          <>
            <TabBar
              title={"EVENTS"}
              onAddClick={handleAddClick}
              submitFunction={filterEventsByName}
              totalCount={totalCount}
              onActiveClick={handleActiveClick}
              onSortByClick={handleSortByClick}
              onSortOrderClick={handleSortOrderClick}
            />
            <AddDialog
              open={isAddDialogOpen}
              onClose={handleCloseAddDialog}
              formData={formData}
              handleInputChange={handleInputChange}
              handleAdd={handleAddEvent}
              title="Add Event"
              alertMessage={alertMessage} // Pass the alert message as a prop
              alertType={alertType}
            />
            <CommonGrid
              items={events}
              deleteHandler={deleteEvent}
              editHandler={editEvent}
              itemType="event"
              onCheckboxClick={handleCheckboxClick}
            />
            <div
              style={{
                backgroundColor: "white",
                marginLeft: "5%",
                marginRight: "5%",
              }}
            >
              <TablePagination
                component="div"
                count={parseInt(totalCount)}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <Notifications
              eventId={selectedEventId}
              applicationId={applicationId}
            />
          </>
        )
      )}
    </>
  );
};

export default Events;
