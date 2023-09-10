/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import apiClient from "../../apiService/api-client";
import Grid1 from "../../common/Grid/Grid1";
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
  TotalCount: string;
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
        .get<ApiResponse>(`/notifications?event_id=${eventId}`)
        .then((response) => {
          console.log("Fetched notifications:", response.data.notifications);
          setNotifications(response.data.notifications);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    } else {
      apiClient
        .get<ApiResponse>("/notifications")
        .then((response) => {
          console.log(
            "Fetched all notifications:",
            response.data.notifications
          );
          setNotifications(response.data.notifications);
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
      event_id: updatedNotification.event_id, // Include the applicationId from props
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

  return (
    <>
      <Grid1
        notifications={notifications}
        editHandler={editNotification}
        deleteHandler={deleteNotification}
      />
    </>
  );
};

export default Notifications;
