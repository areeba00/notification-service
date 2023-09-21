import React, { ChangeEvent } from "react";
import apiClient from "../../apiService/api-client";
import { useEffect, useState } from "react";
import "./Application.css";
import Cards from "./Card/Card";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import "./CardSlider/CardSlider.css";
import Events from "../Events/Events";
import TabBar from "../../common/TabBar/TabBar";
import AddDialog from "../../common/AddDialog/AddDialog";
import { Location } from "history";
import { useBetween } from "use-between";
import States from "../../States";

// Define your alert types
const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};
interface Applications {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface ApiResponse {
  TotalCount: string;
  applications: Applications[];
}
interface LocationState {
  applicationId: number;
  eventId: number;
}

interface ApplicationsProps {
  locationState: LocationState;
}
const Applications: React.FC<ApplicationsProps> = ({ locationState }) => {
  // const { applicationId, eventId } = locationState;
  const [applications, setApplications] = useState<Applications[]>([]);
  const [totalCount, setTotalCount] = useState<string>("");

  // const [selectedApplicationId, setSelectedApplicationId] = useState<
  //   number | null
  // >(null);

  const {
    selectedApplicationId,
    selectedEventId,
    setSelectedApplicationId,
    clikcedCardID,
    setClickedCardID,
  } = useBetween(States);

  // console.log("appsel", selectedApplicationId, "card", clikcedCardID);
  // console.log("ev", selectedEventId);

  const [filtered_Applications, setfiltered_Applications] = useState<
    Applications[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Add a state to control the visibility of events
  const [showEvents, setShowEvents] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards] = useState<number>(calculateVisibleCards());
  const isAtFirstCard = currentIndex === 0;
  const isAtLastCard = currentIndex === filtered_Applications.length - 1;

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<string | null>(null);

  //   // Toggle the isActiveFilter state when the button is clicked
  //   setIsActiveFilter(!isActiveFilter);

  //   // Construct the API URL based on the isActiveFilter value
  //   const apiUrl = `/applications?isActive=${isActiveFilter}`;

  //   // Send the API request using your API client
  //   apiClient
  //     .get(apiUrl)
  //     .then((response) => {
  //       // Handle the response and update your applications state accordingly
  //       const activeapps = response.data.applications;
  //       setApplications(activeapps);
  //       setfiltered_Applications(activeapps);
  //       setTotalCount(response.data.TotalCount);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching filtered applications:", error);
  //     });
  // };

  const handleCardClick = (appId: number) => {
    // Toggle the display of events
    setClickedCardID(clikcedCardID ? 0 : appId);
    setShowEvents(!showEvents);

    // Set the selected application ID only if events are shown
    setSelectedApplicationId(showEvents ? null : appId);

    // setClickedCardID(clikcedCardID ? 0 : clikcedCardID);
  };

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

    // Construct the final URL
    const queryString = queryParams.join("&");
    const url = `/applications${queryString ? `?${queryString}` : ""}`;

    // Fetch data with the updated query parameters
    apiClient
      .get<ApiResponse>(url)
      .then((res) => {
        setApplications(res.data.applications);
        setfiltered_Applications(res.data.applications);
        setTotalCount(res.data.TotalCount);
        setLoading(false);
      })
      .catch((error) => {
        // Handle any error that may occur during the API request
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [isActiveFilter, sortBy, sortOrder]);

  function filterObjectsByName(searchString: string): Applications[] {
    if (searchString) {
      const filteredApps = applications.filter((app) => {
        const name = app.name.toLowerCase();
        return name.includes(searchString.toLowerCase());
      });
      setfiltered_Applications(filteredApps);
    } else {
      // If the search field is empty, display all applications
      setfiltered_Applications(applications);
    }

    setCurrentIndex(0);

    return filtered_Applications;
  }

  // const sortApps = (sortCriteria: "created_at" | "updated_at" | null) => {
  //   // Create a copy of the applications array
  //   const filteredApplicationsCopy = [...applications];

  //   // Toggle the sorting order if the same sorting criteria is clicked again
  //   if (sortCriteria === sortingCriteria) {
  //     filteredApplicationsCopy.reverse(); // Reverse the order
  //     setSortingCriteria(null); // Reset sorting criteria
  //   } else {
  //     // Sort applications based on sortCriteria
  //     if (sortCriteria) {
  //       filteredApplicationsCopy.sort((a, b) => {
  //         if (sortCriteria === "created_at") {
  //           return a.created_at.localeCompare(b.created_at);
  //         } else if (sortCriteria === "updated_at") {
  //           return a.updated_at.localeCompare(b.updated_at);
  //         }
  //         return 0;
  //       });
  //       // Update the sorting criteria state
  //       setSortingCriteria(sortCriteria);
  //     }
  //   }

  //   // Update the state with the sorted applications
  //   setfiltered_Applications(filteredApplicationsCopy);

  //   return filteredApplicationsCopy;
  // };

  const deleteApplication = (application: Applications) => {
    // Create a new array that filters out the application to be deleted
    const updatedApplications = applications.filter(
      (app) => app.id !== application.id
    );

    // Update the state with the new array
    setApplications(updatedApplications);

    const updated_filtered_apps = filtered_Applications.filter(
      (app) => app.id !== application.id
    );
    setfiltered_Applications(updated_filtered_apps);

    apiClient
      .delete("/applications/" + application.id)
      .catch((err) => console.log(err.message));
  };

  const editApplication = (updatedApplication: Applications) => {
    // Remove the "id" field from the payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, ...dataWithoutId } = updatedApplication;

    console.log("hdahdkljkd", updatedApplication.id);
    apiClient
      .put("/applications/" + updatedApplication.id, dataWithoutId)
      .then((response) => {
        const updatedApps = applications.map((app) =>
          app.id === updatedApplication.id ? { ...app, ...dataWithoutId } : app
        );
        setApplications(updatedApps);

        const updated_filtered_apps = filtered_Applications.map((app) =>
          app.id === updatedApplication.id ? { ...app, ...dataWithoutId } : app
        );
        setfiltered_Applications(updated_filtered_apps);
        console.log("Application updated successfully:", response.data);
      })

      .catch((error) => {
        console.error(error.response.data);
      });
  };

  function calculateVisibleCards(): number {
    const screenWidth = window.innerWidth;
    const cardWidth = 240;
    return Math.floor(screenWidth / cardWidth);
  }

  function handleNext() {
    const nextIndex = (currentIndex + 1) % filtered_Applications.length;
    setCurrentIndex(nextIndex);
  }

  function handlePrevious() {
    const prevIndex =
      (currentIndex - 1 + filtered_Applications.length) %
      filtered_Applications.length;
    setCurrentIndex(prevIndex);
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    // Reset the form data to empty fields
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleAddApplication = (newApplication: {
    name: string;
    description: string;
  }) => {
    // Make a POST request to add the new application
    apiClient
      .post("/applications", newApplication)
      .then((response) => {
        // Assuming the server returns the added application data
        const addedApp = response.data;
        setApplications([...applications, addedApp]);
        setfiltered_Applications([...applications, addedApp]);
        setAlertMessage("Data added successfully!");
        setAlertType(ALERT_TYPES.SUCCESS);

        // Close the modal after a brief delay (you can adjust the delay)
        setTimeout(() => {
          handleCloseAddDialog();
        }, 1000);
      })
      .catch((error) => {
        setAlertMessage(error.response.data);
        setAlertType(ALERT_TYPES.ERROR);
      });
  };

  useEffect(() => {
    if (!isAddDialogOpen) {
      setAlertMessage(null);
      setAlertType(null);
    }
  }, [isAddDialogOpen]);

  return (
    <>
      <TabBar
        title={"APPLICATIONS"}
        onAddClick={handleAddClick}
        submitFunction={filterObjectsByName}
        totalCount={totalCount}
        onActiveClick={handleActiveClick}
        onSortByClick={handleSortByClick}
        onSortOrderClick={handleSortOrderClick}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="TBS_slider-container">
              <BiSolidLeftArrow
                onClick={handlePrevious}
                disabled={isAtFirstCard}
                className="TBS_arrow_button_left"
              />

              <div className="TBS_slider">
                <div
                  className="TBS_card-wrapper"
                  style={{ transform: `translateX(-${currentIndex * 240}px)` }} // Adjust card width
                >
                  {filtered_Applications.map((app, index) => (
                    <div
                      key={index}
                      className={`TBS_slider-card ${
                        index >= currentIndex &&
                        index < currentIndex + visibleCards
                          ? "visible"
                          : ""
                      }`}
                    >
                      <Cards
                        clicked_id={clikcedCardID}
                        card_id={app.id}
                        applications={app}
                        deleteHandler={deleteApplication}
                        editHandler={editApplication}
                        onClick={() => handleCardClick(app.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <BiSolidRightArrow
                onClick={handleNext}
                disabled={isAtLastCard}
                className="TBS_arrow_button_right"
                // style={{ width: "5px", height: "10px" }}
              />
            </div>
          </div>
        </div>
      )}
      <AddDialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAdd={handleAddApplication}
        title="Add Application"
        alertMessage={alertMessage} // Pass the alert message as a prop
        alertType={alertType}
      />

      <Events
        applicationId={
          selectedApplicationId === clikcedCardID ? clikcedCardID : null
        }
      />
    </>
  );
};

export default Applications;
