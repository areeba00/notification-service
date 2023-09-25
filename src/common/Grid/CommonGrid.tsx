import React, { ChangeEvent, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";

// Define your alert types
const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import ActionButtonGroup from "../ActionButtonGroup/ActionButtonGroup";
import DialogBox from "../EditDialogBox/DialogBox";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import "./Grid.css";
import NotificationDialog from "../NotificationDialog/NotificationDialog";
import { useNavigate } from "react-router-dom";
import { useBetween } from "use-between";
import States from "../../States";

interface CommonItem {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  application_id?: number;
  event_id?: number;
  template_subject?: string;
  template_body?: string;
  created_at: string;
  updated_at: string;
}

interface Props<T> {
  items: T[]; // Use a generic type parameter T for items
  deleteHandler: (item: T) => void;
  editHandler: (item: T) => void;
  itemType: string; // 'event' or 'notification'
  onCheckboxClick: (itemId: number) => void;
}

const CommonGrid = <T extends CommonItem>({
  items,
  deleteHandler,
  editHandler,
  itemType,
  onCheckboxClick,
}: Props<T>) => {
  const navigate = useNavigate();
  // console.log(items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ...(itemType === "notification" && {
      template_subject: "",
      template_body: "",
    }),
  });

  const { selectedItems, setSelectedItems } = useBetween(States);
  // const [selectedItems, setSelectedItems] = useState<number | null>(null);

  const openModal = (item: T) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      ...(itemType === "notification" && {
        template_subject: item.template_subject || "",
        template_body: item.template_body || "",
      }),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear the alert message when the user starts typing
    if (name === "name" || name === "description") {
      setAlertMessage(null);
      setAlertType(null);
    }
  };

  const handleSave = async () => {
    console.log("here save");

    if (selectedItem) {
      const updatedItem: T = {
        ...selectedItem,
        name: formData.name,
        description: formData.description,
        ...(itemType === "notification" && {
          template_subject: formData.template_subject,
          template_body: formData.template_body,
        }),
      };
      // editHandler(updatedItem);
      // closeModal();
      try {
        console.log("here1");
        const message = await editHandler(updatedItem);

        console.log("message a arhaa hai", message);

        // On success, set the success alert
        setAlertMessage(message);
        console.log("alert message check", alertMessage);
        setAlertType(ALERT_TYPES.SUCCESS);

        // Close the modal after a brief delay (you can adjust the delay)
        setTimeout(() => {
          closeModal();
        }, 1000);
      } catch (error) {
        // On error, set the error alert
        setAlertMessage(error);
        console.log("alert message check", alertMessage);
        setAlertType(ALERT_TYPES.ERROR);
      }
    }
  };

  // Reset the alert when the dialog is opened or closed
  useEffect(() => {
    if (!isModalOpen) {
      setAlertMessage(null);
      setAlertType(null);
    }
  }, [isModalOpen]);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const openDeleteConfirmation = (item: T) => {
    setSelectedItem(item);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteHandler(selectedItem);
      closeDeleteConfirmation();
    }
  };

  const handleCheckboxClick = (itemId: number) => {
    if (selectedItems === itemId) {
      // If the same event is clicked again, unselect it and show all notifications
      setSelectedItems(null);
      onCheckboxClick(null);
    } else {
      setSelectedItems(itemId);
      onCheckboxClick(itemId);
    }
  };

  const handleEditNotification = (notificationId: number) => {
    // Construct the URL for editing the notification
    const editNotificationUrl = `/notifications/${notificationId}`;
    // Navigate to the edit notification route
    navigate(editNotificationUrl);
  };

  const switchActive_fun = async (item: T, active: boolean) => {
    const editedItem: T = {
      ...item,
      isActive: !active,
    };

    console.log("COMMON GRID:", editedItem, editedItem.isActive);
    console.log("cg_check:", active);

    try {
      console.log("here1");
      const message = await editHandler(editedItem);

      console.log("message a arhaa hai", message);

      // On success, set the success alert
      setAlertMessage(message);
      console.log("alert message check", alertMessage);
      setAlertType(ALERT_TYPES.SUCCESS);

      // Close the modal after a brief delay (you can adjust the delay)
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      // On error, set the error alert
      setAlertMessage(error);
      console.log("alert message check", alertMessage);
      setAlertType(ALERT_TYPES.ERROR);
    }
  };

  return (
    <>
      <br />
      <div className="table-container">
        <Paper className="paper">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {itemType === "event" && <TableCell></TableCell>}
                  <TableCell>
                    <strong>
                      {itemType === "event"
                        ? "Event Name"
                        : "Notification Name"}
                    </strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell className="actions-column">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    {itemType === "event" && (
                      <TableCell className="checkbox-cell">
                        <Checkbox
                          onClick={() => handleCheckboxClick(item.id)}
                          color="primary"
                          checked={selectedItems === item.id} // Highlight selected checkboxes
                        />
                      </TableCell>
                    )}
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {itemType === "event" ? (
                        // Render the action buttons for events
                        <ActionButtonGroup
                          onEditClick={() => openModal(item)}
                          onDeleteClick={() => openDeleteConfirmation(item)}
                          isActive={item.isActive}
                          switchActive_fun={() => {
                            switchActive_fun(item, item.isActive);
                          }}
                        />
                      ) : (
                        // Render the action buttons for notifications with different edit behavior
                        <ActionButtonGroup
                          onEditClick={() => handleEditNotification(item.id)}
                          onDeleteClick={() => openDeleteConfirmation(item)}
                          isActive={item.isActive}
                          switchActive_fun={() => {
                            switchActive_fun(item, item.isActive);
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      <div>
        {itemType === "event" ? (
          <DialogBox
            open={isModalOpen}
            onClose={closeModal}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            alertMessage={alertMessage}
            alertType={alertType}
            title={"Event"}
          />
        ) : (
          <NotificationDialog
            open={isModalOpen}
            onClose={closeModal}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
          />
        )}
      </div>

      <div>
        {itemType === "event" ? (
          <DeleteDialog
            open={isDeleteConfirmationOpen}
            onClose={closeDeleteConfirmation}
            onConfirm={confirmDelete}
            title={"event"}
          />
        ) : (
          <DeleteDialog
            open={isDeleteConfirmationOpen}
            onClose={closeDeleteConfirmation}
            onConfirm={confirmDelete}
            title={"notification"}
          />
        )}
      </div>
    </>
  );
};

export default CommonGrid;
