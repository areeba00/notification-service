import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // You can use Axios for making HTTP requests
import apiClient from "../../apiService/api-client";
import "./NotificationEdit.css";
import {
  Button,
  Grid,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
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

  // Separate state variables for each input field
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState<Notifications>({
    id: 0,
    name: "",
    description: "",
    event_id: 0,
    template_subject: "",
    template_body: "",
    created_at: "",
    updated_at: "",
    isActive: false,
    tags: [],
  });

  useEffect(() => {
    // Fetch the current notification data using the notificationId
    apiClient
      .get<Notifications>(`/notifications/${notificationId}`)
      .then((response) => {
        const notificationData = response.data;
        console.log(notificationData);
        // Update the state variables for editing
        setName(notificationData.name);
        setDescription(notificationData.description);
        setSubject(notificationData.template_subject);
        setBody(notificationData.template_body);

        // Update formData for submission (if needed)
        setFormData(notificationData);
        // Initialize the preview with subject and body
        setPreview(
          `Subject: ${notificationData.template_subject}\n${notificationData.template_body}`
        );
      })
      .catch((error) => {
        console.error("Error fetching notification data:", error);
      });
  }, [notificationId]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Create an object with the updated data
    const updatedData = {
      name,
      description,
      template_subject: subject,
      template_body: body,
    };

    // Send a PATCH request with the updated data
    apiClient
      .patch(`/notifications/${notificationId}`, updatedData)
      .then((response) => {
        console.log("Notification updated successfully!");
        // You can navigate back to the list or perform any other action here
      })
      .catch((error) => {
        console.error("Error updating notification:", error);
      });
  };

  // Update the preview whenever subject or body changes
  useEffect(() => {
    setPreview(`Subject: ${subject}\n${body}`);
  }, [subject, body]);

  return (
    <Grid container spacing={2} className="grid-container">
      <Grid item xs={6} className="grid-left">
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Subject"
            variant="outlined"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            placeholder="Body"
            // rowsMin={5}
            fullWidth
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button type="button" variant="outlined">
              Cancel
            </Button>
          </div>
        </form>
      </Grid>
      <Grid item xs={6} className="grid-right">
        <Typography variant="body1">
          {`Subject: ${subject}\n${body}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EditNotificationPage;
