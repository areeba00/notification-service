// import React, { ChangeEvent, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import "./Grid.css";
import ActionButtonGroup from "../ActionButtonGroup/ActionButtonGroup";
import { ChangeEvent, useState } from "react";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import NotificationDialog from "../NotificationDialog/NotificationDialog";

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
interface Props {
  notifications: Notifications[];
  deleteHandler: (notification: Notifications) => void;
  editHandler: (notification: Notifications) => void;
}

const Grid1 = ({ notifications, deleteHandler, editHandler }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notifications | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template_subject: "",
    template_body: "",
  });

  const openModal = (event: Notifications) => {
    setSelectedNotification(event);
    setFormData({
      name: event.name,
      description: event.description,
      template_subject: event.template_subject,
      template_body: event.template_body,
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
  };

  const handleSave = () => {
    if (selectedNotification) {
      // Create a new event object with updated name and description
      const updatedNotification: Notifications = {
        ...selectedNotification,
        name: formData.name,
        description: formData.description,
        template_subject: formData.template_subject,
        template_body: formData.template_body,
      };
      // Call the editHandler to update the event
      editHandler(updatedNotification);
      closeModal();
    }
  };

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const openDeleteConfirmation = (notification: Notifications) => {
    setSelectedNotification(notification);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const confirmDelete = () => {
    if (selectedNotification) {
      deleteHandler(selectedNotification);
      closeDeleteConfirmation();
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
                  <TableCell></TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell className="actions-column">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="checkbox-cell">
                      <Checkbox color="primary" />
                    </TableCell>
                    <TableCell>{notification.name}</TableCell>
                    <TableCell>{notification.description}</TableCell>
                    <TableCell>
                      <ActionButtonGroup
                        onEditClick={() => openModal(notification)}
                        onDeleteClick={() =>
                          openDeleteConfirmation(notification)
                        }
                        isActive={notification.isActive}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      <div>
        <NotificationDialog
          open={isModalOpen}
          onClose={closeModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
        />
      </div>
      <div>
        <DeleteDialog
          open={isDeleteConfirmationOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={confirmDelete}
        />
      </div>
    </>
  );
};

export default Grid1;
