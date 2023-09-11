// Import necessary components and libraries
import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the notification ID
import NotificationDialog from "../../common/NotificationDialog/NotificationDialog";
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
const EditNotificationPage = () => {
  const { notificationId } = useParams(); 

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
      const updatedEvent: Notifications = {
        ...selectedNotification,
        name: formData.name,
        description: formData.description,
        template_subject: formData.template_subject,
        template_body: formData.template_body,
      };
      // Call the editHandler to update the event
      editHandler(updatedEvent);
      closeModal();
    }
  };

  return (
    <div>
      <h1>Edit Notification</h1>
      <NotificationDialog
          open={isModalOpen}
          onClose={closeModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
        />
    </div>
  );
};

export default EditNotificationPage;
