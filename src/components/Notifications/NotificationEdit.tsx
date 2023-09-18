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
import { List, ListItem, ListItemText } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
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
interface Tags {
  id?: string;
  label: string;
}
const EditNotificationPage = () => {
  // navigation route
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [tags, setTags] = useState<Tags[]>([]); // State variable for tags
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch tags from the API when the component mounts
  useEffect(() => {
    apiClient
      .get("/tags")
      .then((response) => {
        setTags(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

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

  // getting id's from urls
  const { notificationId, eventId } = useParams();

  const notificationSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(5),
    template_subject: z.string().min(5),
    template_body: z.string().min(5),
  });

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
              // value={templateBody}
              // onChange={handleTemplateBodyChange}
            />
            {bodyError && <div className="validation-error">{bodyError}</div>}

            <FormControl fullWidth>
              <InputLabel htmlFor="tag-select">Select a tag</InputLabel>
              <Select
                onChange={(e) => handleTagSelect(e.target.value)}
                value={selectedTag || ""}
                style={{ width: "100%" }}
                labelId="tag-select"
              >
                <MenuItem value="" disabled>
                  Select a tag
                </MenuItem>
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.label}>
                    {tag.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
    </>
  );
};

export default EditNotificationPage;
