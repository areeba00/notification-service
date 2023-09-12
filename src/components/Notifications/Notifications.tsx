/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import apiClient from "../../apiService/api-client";
import Grid1 from "../../common/Grid/Grid1";
import TabBar from "../../common/TabBar/TabBar";
// ... other imports ...

interface Notifications {
  id: number;
  name: string;
  description: string;
  event_id: number;
  template_subject: string;
  template_body: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
  tags: string[];
}

interface ApiResponse {
  // TotalCount: string;
  notifications: Notifications[];
}
interface NotificationProps {
  eventId: number | null; // Selected application ID
}

const Notifications = ({ eventId }: NotificationProps) => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  // Fetch events when the selected application ID changes
  useEffect(() => {
    if (eventId !== null) {
      // Fetch events using the selected application ID
      apiClient
        .get(`/notifications?event_id=${eventId}`)
        .then((response) => {
          console.log("Fetched notifications:", response.data);
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    } else {
      apiClient
        .get("/notifications")
        .then((response) => {
          console.log(
            "Fetched all notifications:",
            response.data
          );
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error("Error fetching all notifications:", error);
        });
    }
  }, [eventId]);

  // delete api

  const deleteNotification = (notification: Notifications) => {
    // Create a new array that filters out the event to be deleted
    const updatedEvents = notifications.filter(
      (notification) => notification.id !== notification.id
    );

    // Update the state with the new array
    setNotifications(updatedEvents);

    apiClient
      .delete("/notifications/" + notification.id)
      .catch((err) => console.log(err.message));
  };

  //edit api

  const editNotification = (updatedNotification: Notifications) => {
    // Create an object with the updated event data
    const updatedNotificationData = {
      name: updatedNotification.name,
      description: updatedNotification.description,
      template_subject: updatedNotification.template_subject,
      template_body: updatedNotification.template_body,
      event_id: updatedNotification.event_id,
    };

    // Send a PUT request to update the event on the server
    apiClient
      .patch(
        `/notifications/${updatedNotification.id}`,
        updatedNotificationData
      )
      .then((response) => {
        // Assuming the server returns the updated event data
        const updatedNotifications = notifications.map((notification) =>
          notification.id === updatedNotification.id
            ? response.data
            : notification
        );
        setNotifications(updatedNotifications);
      })
      .catch((error) => {
        console.error("Error updating notification:", error);
      });
  };

  // add dialog
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

  return (
    <>
      <TabBar title={"Notifications"} onAddClick={handleAddClick} />
      <Grid1
        notifications={notifications}
        editHandler={editNotification}
        deleteHandler={deleteNotification}
      />
    </>
  );
};

export default Notifications;
