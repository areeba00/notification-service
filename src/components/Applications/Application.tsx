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

function Applications() {
  const [applications, setApplications] = useState<Applications[]>([]);
  const [totalCount, setTotalCount] = useState<string>("");

  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);

  const [filtered_Applications, setfiltered_Applications] = useState<
    Applications[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Add a state to control the visibility of events
  const [showEvents, setShowEvents] = useState(false);

  const [clikcedCardID, setClickedCardID] = useState<number>(0);

  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);

  const handleIsActiveFilterClick = () => {
    // Toggle the isActiveFilter state when the button is clicked
    setIsActiveFilter(!isActiveFilter);

    // Construct the API URL based on the isActiveFilter value
    const apiUrl = `/applications?isActive=${isActiveFilter}`;

    // Send the API request using your API client
    apiClient
      .get(apiUrl)
      .then((response) => {
        // Handle the response and update your applications state accordingly
        const activeapps = response.data.applications;
        setApplications(activeapps);
        setfiltered_Applications(activeapps);
        setTotalCount(response.data.TotalCount);
      })
      .catch((error) => {
        console.error("Error fetching filtered applications:", error);
      });
  };

  const handleCardClick = (appId: number) => {
    // Toggle the display of events
    setClickedCardID(clikcedCardID ? 0 : appId);
    setShowEvents(!showEvents);

    // Set the selected application ID only if events are shown
    setSelectedApplicationId(showEvents ? null : appId);

    // setClickedCardID(clikcedCardID ? 0 : clikcedCardID);
  };

  useEffect(() => {
    apiClient
      .get<ApiResponse>("/applications")
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
  }, []);

  // FILTERING APPLICATIONS

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
    const { id, created_at, updated_at, isActive, ...dataWithoutId } =
      updatedApplication;

    const updatedApps = applications.map((app) =>
      app.id === updatedApplication.id ? { ...app, ...dataWithoutId } : app
    );
    setApplications(updatedApps);

    const updated_filtered_apps = filtered_Applications.map((app) =>
      app.id === updatedApplication.id ? { ...app, ...dataWithoutId } : app
    );
    setfiltered_Applications(updated_filtered_apps);

    // Send a PUT request to update the application on the server
    apiClient
      .patch("/applications/" + updatedApplication.id, dataWithoutId) // Send the updated data without the "id"
      .then((response) => {
        console.log("Application updated successfully:", response.data);
      })

      .catch((error) => {
        console.error("Error updating application:", error);
      });
  };

  // card things

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards] = useState<number>(calculateVisibleCards());

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

  const isAtFirstCard = currentIndex === 0;
  const isAtLastCard = currentIndex === filtered_Applications.length - 1;

  // add application functionality

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
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
        handleCloseAddDialog();
      })
      .catch((error) => {
        console.error("Error adding application:", error);
      });
  };

  return (
    <>
      <TabBar
        title={"APPLICATIONS"}
        onAddClick={handleAddClick}
        submitFunction={filterObjectsByName}
        totalCount={totalCount}
        onIsActiveFilterClick={handleIsActiveFilterClick}
      />
      {loading ? (
        <div>Loading...</div> // Show loading indicator while fetching data
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="TBS_slider-container">
              <BiSolidLeftArrow
                onClick={handlePrevious}
                disabled={isAtFirstCard}
                className="TBS_arrow_button_left"
                // style={{ width: "5px", height: "10px" }}
              />

              <div className="TBS_slider">
                <div
                  className="TBS_card-wrapper"
                  style={{ transform: `translateX(-${currentIndex * 260}px)` }} // Adjust card width
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
      />

      <Events
        applicationId={
          selectedApplicationId === clikcedCardID ? clikcedCardID : null
        }
      />
    </>
  );
}

export default Applications;
