/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import apiClient from "../../apiService/api-client";
import TabBar from "../../common/TabBar/TabBar";
import CommonGrid from "../../common/Grid/CommonGrid";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { TablePagination } from "@mui/material";
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
interface NotificationProps {
  eventId: number | null;
  applicationId: number | null;
}

const Notifications = ({ eventId, applicationId }: NotificationProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [originalNotifications, setOriginalNotifications] = useState<
    Notifications[]
  >([]);
  const [totalCount, setTotalCount] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<
    "name" | "created_at" | "updated_at" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );

  const handleActiveClick = (isActive: boolean | undefined) => {
    setIsActiveFilter(isActive);
  };
  const handleSortByClick = (
    sortByValue: "name" | "created_at" | "updated_at" | undefined
  ) => {
    setSortBy(sortByValue);
  };

  const handleSortOrderClick = (sortOrderValue: "asc" | "desc" | undefined) => {
    setSortOrder(sortOrderValue);
  };

  useEffect(() => {
    // Construct the query string with optional parameters
    const queryParams = [];

    if (isActiveFilter !== undefined) {
      queryParams.push(`isActive=${isActiveFilter}`);
    }

    if (sortBy) {
      queryParams.push(`sortBy=${sortBy}`);
    }

    if (sortOrder) {
      queryParams.push(`sortOrder=${sortOrder}`);
    }

    // Join the query parameters with '&' and construct the final query string
    const queryString = queryParams.join("&");
    if (eventId !== null) {
      // Fetch events using the selected application ID
      apiClient
        .get<ApiResponse>(
          `/notifications?event_id=${eventId}&page=${
            page + 1
          }&limit=${rowsPerPage}&${queryString}`
        )
        .then((response) => {
          const notificationsData = response.data.notifications;
          setOriginalNotifications(notificationsData);
          setNotifications(notificationsData);
          setTotalCount(response.data.TotalCount);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    } else {
      setNotifications([]);
    }
    setTotalCount("");
  }, [eventId, page, rowsPerPage, isActiveFilter, sortBy, sortOrder]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset the page to 0 when changing rows per page
  };

  const deleteNotification = (notification: Notifications) => {
    // Create a new array that filters out the event to be deleted
    const updatedEvents = notifications.filter(
      (notification) => notification.id !== notification.id
    );

    // Update the state with the new array
    setNotifications(updatedEvents);

    apiClient
      .delete("/notifications/" + notification.id)
      .catch((err) => console.log(err.message));
  };

  const editNotification = (updatedNotification: Notifications) => {
    console.log("here3");
    // Create an object with the updated event data
    const updatedNotificationData = {
      name: updatedNotification.name,
      description: updatedNotification.description,
      template_subject: updatedNotification.template_subject,
      template_body: updatedNotification.template_body,
      event_id: updatedNotification.event_id,
      isActive: updatedNotification.isActive,
    };

    console.log(
      "NIFICATIONS: isActive changed to:",
      updatedNotification.isActive
    );
    // Send a PUT request to update the event on the server
    apiClient
      .patch(
        `/notifications/${updatedNotification.id}`,
        updatedNotificationData
      )
      .then((response) => {
        // Assuming the server returns the updated event data
        const updatedNotifications = notifications.map((notification) =>
          notification.id === updatedNotification.id
            ? response.data
            : notification
        );
        setNotifications(updatedNotifications);
      })
      .catch((error) => {
        console.error("Error updating notification:", error);
      });
  };

  const handleAddClick = () => {
    const notificationAddUrl = `/add-notification/${eventId}/${applicationId}`;
    navigate(notificationAddUrl);
  };

  function filterNotificationsByName(searchString: string): Notifications[] {
    if (searchString) {
      const filteredNotifications = notifications.filter((notification) => {
        const name = notification.name.toLowerCase();
        return name.includes(searchString.toLowerCase());
      });
      setNotifications(filteredNotifications);
    } else {
      setNotifications(originalNotifications);
    }

    return notifications;
  }

  return (
    <>
      {eventId === null && (
        <Alert severity="info" className="my-Alerts">
          <AlertTitle>Info</AlertTitle>
          No Notifications to show — <strong>Kindly select an event!</strong>
        </Alert>
      )}

      {eventId != null && notifications.length === 0 ? (
        <>
          <TabBar
            title={"NOTIFICATIONS"}
            onAddClick={handleAddClick}
            submitFunction={filterNotificationsByName}
            totalCount={totalCount}
            onActiveClick={handleActiveClick}
            onSortByClick={handleSortByClick}
            onSortOrderClick={handleSortOrderClick}
          />
          <Alert severity="warning" className="my-Alerts">
            No notifications found —{" "}
            <strong>This Event has no corresponding notifications!</strong>
          </Alert>
        </>
      ) : (
        eventId !== null && (
          <>
            <TabBar
              title={"NOTIFICATIONS"}
              onAddClick={handleAddClick}
              submitFunction={filterNotificationsByName}
              totalCount={totalCount}
              onActiveClick={handleActiveClick}
              onSortByClick={handleSortByClick}
              onSortOrderClick={handleSortOrderClick}
            />
            <CommonGrid
              items={notifications}
              editHandler={editNotification}
              deleteHandler={deleteNotification}
              itemType="notification"
            />
            <TablePagination
              component="div"
              count={parseInt(totalCount)}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )
      )}
    </>
  );
};

export default Notifications;
