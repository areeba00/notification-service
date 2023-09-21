/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../apiService/api-client";

import "./NotificationEdit.css";
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { z, ZodError } from "zod";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import { useBetween } from "use-between";
import States from "../../States";

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
interface Tags {
  id?: string;
  label: string;
}
const EditNotificationPage = () => {
  // navigation route
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [tags, setTags] = useState<Tags[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get("/tags")
      .then((response) => {
        setTags(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, [tags]);

  // Transform your tags array into the format expected by react-mentions
  const mentionTags: SuggestionDataItem[] = tags.map((tag) => ({
    id: tag.id || "", // Assuming tag.id is a string
    display: tag.label,
  }));

  // Event handler to add a selected tag to the template body
  const handleTagSelect = (tag: string) => {
    if (tag && !selectedTag) {
      // If a tag is selected and no tag is currently added
      setBody(`${body} {${tag}}`);
      setSelectedTag(null);
    }
  };

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

  const { selectedApplicationId } = useBetween(States);

  const { notificationId, eventId, applicationId } = useParams();

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
    let hasError = false;

    // Check if name is empty
    if (!formData.name) {
      setNameError("Name is required.");
      hasError = true;
    } else if (formData.name.length < 3) {
      setNameError("Name must contain at least 3 characters.");
      hasError = true;
    } else {
      setNameError(null);
    }

    // Check if description is empty
    if (!formData.description) {
      setDescriptionError("Description is required.");
      hasError = true;
    } else if (formData.description.length < 5) {
      setDescriptionError("Description must contain at least 5 characters.");
      hasError = true;
    } else {
      setDescriptionError(null);
    }

    // Check if subject is empty
    if (!formData.template_subject) {
      setSubjectError("Template Subject is required.");
      hasError = true;
    } else if (formData.template_subject.length < 5) {
      setSubjectError("Template Subject must contain at least 5 characters.");
      hasError = true;
    } else {
      setSubjectError(null);
    }

    // Check if body is empty
    if (!formData.template_body) {
      setBodyError("Template Body is required.");
      hasError = true;
    } else if (formData.template_body.length < 5) {
      setBodyError("Template Body must contain at least 5 characters.");
      hasError = true;
    } else {
      setBodyError(null);
    }
    if (!hasError) {
      if (notificationId) {
        // Editing an existing notification, send a PATCH request
        apiClient
          .patch(`/notifications/${notificationId}`, formData)
          .then((response) => {
            setDialogMessage("Notification updated successfully!");
            setIsDialogOpen(true);
          })
          .catch((error) => {
            setDialogMessage(error.response.data);
            setIsDialogOpen(true);
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
          })
          .catch((error) => {
            setDialogMessage(error.response.data);
            setIsDialogOpen(true);
          });
      }
    }
  };

  // navigation back
  const handleCancelButtonClick = () => {
    // Navigate back to the desired URL when the cancel button is clicked
    navigate("/Dashboard", {
      // state: { eventId: eventId, applicationId: applicationId },
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Update the preview whenever subject or body changes
  useEffect(() => {
    setPreview(`Subject: ${subject}\n${body}`);
  }, [subject, body]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    setDescriptionError(null);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
    setSubjectError(null);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
    setBodyError(null);
  };

  return (
    <>
      <Grid container spacing={2} className="grid-container">
        <Grid item xs={6} className="grid-left">
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              required
              variant="outlined"
              fullWidth
              value={name}
              onChange={handleNameChange}
            />
            {nameError && <div className="validation-error">{nameError}</div>}
            <TextField
              label="Description"
              required
              variant="outlined"
              fullWidth
              value={description}
              onChange={handleDescriptionChange}
            />
            {descriptionError && (
              <div className="validation-error">{descriptionError}</div>
            )}

            <TextField
              label="Template Subject"
              required
              variant="outlined"
              fullWidth
              value={subject}
              onChange={handleSubjectChange}
            />
            {subjectError && (
              <div className="validation-error">{subjectError}</div>
            )}

            <MentionsInput
              className="custom-mentions-input"
              required
              value={body}
              onChange={handleBodyChange}
              placeholder="Template Body"
              style={{ height: "calc(6 * 1.5em)" }}
            >
              <Mention
                trigger="{"
                data={mentionTags} // Use the transformed mentionTags array
                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                  <div className="custom-mention ">{highlightedDisplay}</div>
                )}
                displayTransform={(id, display) => `{${display}}`}
                markup="{__display__}"
              />
            </MentionsInput>
            {bodyError && <div className="validation-error">{bodyError}</div>}
            <div className="buttonContainer">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
                style={{ width: "140px", marginRight: "20px" }}
                className="submitButton"
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
            {subject}
            <br /> <br />
            {body}
          </Typography>
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="lg">
        <DialogContent>
          <div style={{ display: "flex", alignItems: "center" }}>
            {dialogMessage.includes("successfully") ? (
              <VerifiedIcon style={{ color: "green" }} fontSize="large" />
            ) : (
              <ReportGmailerrorredIcon color="error" fontSize="large" />
            )}
            <Typography style={{ marginLeft: "10px" }}>
              {dialogMessage}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditNotificationPage;
