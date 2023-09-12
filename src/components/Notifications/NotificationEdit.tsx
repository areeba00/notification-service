import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // You can use Axios for making HTTP requests
import apiClient from "../../apiService/api-client";

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

const EditNotificationPage = () => {
  const { notificationId } = useParams(); // Get the notification ID from URL parameter
  console.log(notificationId);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template_subject: "",
    template_body: "",
  });

  useEffect(() => {
    // Fetch the current notification data using the notificationId
    apiClient
      .get<Notifications>(`/notifications/${notificationId}`)
      .then((response) => {
        const notificationData = response.data;
        console.log(notificationData);
        setFormData({
          name: notificationData.name,
          description: notificationData.description,
          template_subject: notificationData.template_subject,
          template_body: notificationData.template_body,
        });
      })
      .catch((error) => {
        console.error("Error fetching notification data:", error);
      });
  }, [notificationId]);

  const handleFormSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Send a PATCH request with the updated data
    axios
      .patch(`/api/notifications/${notificationId}`, formData)
      .then((response) => {
        console.log("Notification updated successfully!");
        // You can navigate back to the list or perform any other action here
      })
      .catch((error) => {
        console.error("Error updating notification:", error);
      });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h1>Edit Notification</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        {/* Repeat similar input fields for description, template_subject, and template_body */}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditNotificationPage;
