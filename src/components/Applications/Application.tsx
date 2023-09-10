import React from "react";
import apiClient from "../../apiService/api-client";
import { useEffect, useState } from "react";
import "./Application.css";
import Cards from "./Card/Card";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import "./CardSlider/CardSlider.css";
import Events from "../Events/Events";
import TabBar from "../../common/TabBar/TabBar";

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

  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  // Add a state to control the visibility of events
  const [showEvents, setShowEvents] = useState(false);

  const handleCardClick = (appId: number) => {
    // Toggle the display of events
    setShowEvents(!showEvents);

    // Set the selected application ID only if events are shown
    setSelectedApplicationId(showEvents ? null : appId);
  };

  useEffect(() => {
    apiClient
      .get<ApiResponse>("/applications")
      .then((res) => setApplications(res.data.applications));
  }, []);

  const deleteApplication = (application: Applications) => {
    // Create a new array that filters out the application to be deleted
    const updatedApplications = applications.filter(
      (app) => app.id !== application.id
    );

    // Update the state with the new array
    setApplications(updatedApplications);

    apiClient
      .delete("/applications/" + application.id)
      .catch((err) => console.log(err.message));
  };

  const editApplication = (updatedApplication: Applications) => {
    // Remove the "id" field from the payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, isActive, ...dataWithoutId } =
      updatedApplication;

    // Send a PUT request to update the application on the server
    apiClient
      .put("/applications/" + updatedApplication.id, dataWithoutId) // Send the updated data without the "id"
      .then((response) => {
        // Assuming the server returns the updated application data
        const updatedApps = applications.map((app) =>
          app.id === updatedApplication.id ? response.data : app
        );
        setApplications(updatedApps);
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
    const cardWidth = 300;
    return Math.floor(screenWidth / cardWidth);
  }

  function handleNext() {
    const nextIndex = (currentIndex + 1) % applications.length;
    setCurrentIndex(nextIndex);
  }

  function handlePrevious() {
    const prevIndex =
      (currentIndex - 1 + applications.length) % applications.length;
    setCurrentIndex(prevIndex);
  }

  const isAtFirstCard = currentIndex === 0;
  const isAtLastCard = currentIndex === applications.length - 1;

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="TBS_slider-container">
            <BiSolidLeftArrow
              onClick={handlePrevious}
              disabled={isAtFirstCard}
              className="TBS_arrow_button"
            />

            <div className="TBS_slider">
              <div
                className="TBS_card-wrapper"
                style={{ transform: `translateX(-${currentIndex * 350}px)` }} // Adjust card width
              >
                {applications.map((app, index) => (
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
              className="TBS_arrow_button"
            />
          </div>
        </div>
      </div>
      <TabBar title={"EVENTS"} />
      <Events applicationId={selectedApplicationId} />
    </>
  );
}

export default Applications;
