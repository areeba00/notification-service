/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../apiService/api-client";
import "./NotificationEdit.css";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { z, ZodError } from "zod";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Notifications {
  id?: number;
  name: string;
  description: string;
  event_id?: number;
  template_subject: string;
  template_body: string;
  created_at?: string;
  updated_at?: string;
  isActive?: boolean;
  tags?: string[];
}

const EditNotificationPage = () => {
  // navigation route
  const navigate = useNavigate();

  // tags getting

  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Fetch tag suggestions when the component mounts
    fetchTagSuggestions();
  }, []);

  const fetchTagSuggestions = () => {
    // Make a GET request to fetch tag suggestions from the /tags endpoint
    apiClient
      .get("/tags")
      .then((response) => {
        const tagSuggestions = response.data.map((tag) => tag.label);
        setTagSuggestions(tagSuggestions);
      })
      .catch((error) => {
        console.error("Error fetching tag suggestions:", error);
      });
  };

  const handleTagClick = (tag) => {
    // Handle tag selection and auto-complete the input value
    const updatedInputValue = inputValue.replace("{", `{${tag} `);
    setInputValue(updatedInputValue);

    // Clear the tag suggestions
    setTagSuggestions([]);
  };

  // State for popover
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchTagSuggestions(); // Fetch tag suggestions when '{' is entered
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  // getting id's from urls
  const { notificationId, eventId } = useParams();

  const notificationSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(5),
    template_subject: z.string().min(5),
    template_body: z.string().min(5),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // Separate state variables for each input field
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ZodError | null>(
    null
  );

  const validateForm = (data: Notifications) => {
    try {
      notificationSchema.parse(data);
      setNameError(null);
      setDescriptionError(null);
      setSubjectError(null);
      setBodyError(null);
      return null; // No errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, (message: string | null) => void> = {
          name: setNameError,
          description: setDescriptionError,
          template_subject: setSubjectError,
          template_body: setBodyError,
        };

        error.issues.forEach((issue) => {
          const setErrorFunction = errorMap[issue.path[0]];
          if (setErrorFunction) {
            setErrorFunction(issue.message);
          }
        });
      }
      return error;
    }
  };

  // const [formData, setFormData] = useState<Notifications>({
  //   id: 0,
  //   name: "",
  //   description: "",
  //   event_id: 0,
  //   template_subject: "",
  //   template_body: "",
  //   created_at: "",
  //   updated_at: "",
  //   isActive: false,
  //   tags: [],
  // });

  useEffect(() => {
    if (notificationId) {
      // Fetch the current notification data using the notificationId
      apiClient
        .get(`/notifications/${notificationId}`)
        .then((response) => {
          const notificationData = response.data;
          // Update the state variables for editing
          setName(notificationData.name);
          setDescription(notificationData.description);
          setSubject(notificationData.template_subject);
          setBody(notificationData.template_body);
        })
        .catch((error) => {
          console.error("Error fetching notification data:", error);
        });
    }
  }, [notificationId]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Create an object with the data to be submitted
    const formData = {
      name,
      description,
      template_subject: subject,
      template_body: body,
    };

    // Validate the form data
    const validationError = validateForm(formData);

    if (validationError) {
      setValidationErrors(validationError as ZodError<any>);
    } else {
      setValidationErrors(null);

      if (notificationId) {
        // Editing an existing notification, send a PATCH request
        apiClient
          .patch(`/notifications/${notificationId}`, formData)
          .then((response) => {
            setDialogMessage("Notification updated successfully!");
            setIsDialogOpen(true);
          })
          .catch((error) => {
            setDialogMessage("Error updating notification.");
            setIsDialogOpen(true);
            console.error("Error updating notification:", error);
          });
      } else {
        const eventIdAsNumber = eventId ? parseInt(eventId, 10) : undefined;
        const notificationAddData: Notifications = {
          ...formData,
          event_id: eventIdAsNumber, // Use the converted value
        };
        // Adding a new notification, send a POST request
        apiClient
          .post(`/notifications`, notificationAddData) // No need to include eventId in the URL
          .then((response) => {
            setDialogMessage("Notification added successfully!");
            setIsDialogOpen(true);
            console.log("Notification added successfully!");
            // You can navigate back to the list or perform any other action here
          })
          .catch((error) => {
            setDialogMessage("Error adding notification.");
            setIsDialogOpen(true);

            console.error("Error adding notification:", error);
          });
      }
    }
  };

  // navigation back
  const handleCancelButtonClick = () => {
    // Navigate back to the desired URL when the cancel button is clicked
    navigate("/Dashboard");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Update the preview whenever subject or body changes
  useEffect(() => {
    setPreview(`Subject: ${subject}\n${body}`);
  }, [subject, body]);

  return (
    <>
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
            {nameError && <div className="validation-error">{nameError}</div>}
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && (
              <div className="validation-error">{descriptionError}</div>
            )}

            <TextField
              label="Template Subject"
              variant="outlined"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            {subjectError && (
              <div className="validation-error">{subjectError}</div>
            )}
            <TextField
              label="Template Body"
              placeholder="Body"
              multiline
              rows={5}
              fullWidth
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {bodyError && <div className="validation-error">{bodyError}</div>}
            <div className="buttonContainer">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
                style={{ width: "140px", marginRight: "20px" }}
                className="submitButton" // Add the custom className for the submit button
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="outlined"
                style={{ width: "140px" }}
                className="cancelButton"
                onClick={handleCancelButtonClick}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Grid>
        <Grid item xs={6} className="grid-right">
          <Typography variant="body1">
            Subject: {subject}
            <br /> <br />
            Body: {body}
          </Typography>
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="md">
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <List>
        {tagSuggestions.map((tag, index) => (
          <ListItem button key={index} onClick={() => handleTagClick(tag)}>
            <ListItemText primary={tag} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default EditNotificationPage;
