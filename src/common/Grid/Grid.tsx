import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Grid.css";

// interface GridProp {
//   id: number;
//   name: string;
//   enabled: boolean;
//   Description: string;
// }

interface Events {
  id: number;
  name: string;
  description: string;
  application_id: number;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface GridComponentProps {
  events: Events[];
}
const Grid = ({ events }: GridComponentProps) => {
  console.log("Props in Grid component:", events);
  if (events.length === 0) {
    return <div>Loading...</div>;
  }
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
                {events.map((event) => {
                  console.log("Event Name:", event.name);
                  console.log("Event Description:", event.description);

                  return (
                    <TableRow key={event.id}>
                      <TableCell className="checkbox-cell">
                        <Checkbox color="primary" />
                      </TableCell>
                      <TableCell>{event.name}</TableCell>
                      <TableCell> {event.description}</TableCell>
                      <TableCell>
                        <IconButton>
                          <EditIcon className="Edit-icon" />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon className="Delete-icon" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
  );
};

export default Grid;
