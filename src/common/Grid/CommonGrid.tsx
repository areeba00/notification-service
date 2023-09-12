import React, { ChangeEvent, useState } from "react";
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
import ActionButtonGroup from "../ActionButtonGroup/ActionButtonGroup";
import DialogBox from "../EditDialogBox/DialogBox";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import "./Grid.css";

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
  console.log(items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const openModal = (item: T) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
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
    if (selectedItem) {
      const updatedItem: T = {
        ...selectedItem,
        name: formData.name,
        description: formData.description,
      };
      editHandler(updatedItem);
      closeModal();
    }
  };

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

  const [selectedItems, setSelectedItems] = useState<number | null>(null);

  const handleCheckboxClick = (itemId: number) => {
    // onCheckboxClick(itemId);
    if (selectedItems === itemId) {
      // If the same event is clicked again, unselect it
      setSelectedItems(null);
    } else {
      setSelectedItems(itemId);
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
                  <TableCell>
                    {itemType === "event" ? "Event Name" : "Notification Name"}
                  </TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell className="actions-column">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="checkbox-cell">
                      <Checkbox
                        onClick={() => handleCheckboxClick(item.id)}
                        color="primary"
                        checked={selectedItems === item.id} // Highlight selected checkboxes
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <ActionButtonGroup
                        onEditClick={() => openModal(item)}
                        onDeleteClick={() => openDeleteConfirmation(item)}
                        isActive={item.isActive}
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
        <DialogBox
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

export default CommonGrid;
