import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "./Application.css";

import Cards from "./Card/Card";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import "./CardSlider/CardSlider.css";

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

  useEffect(() => {
    axios
      .get<ApiResponse>("http://localhost:5000/api/applications")
      .then((res) => setApplications(res.data.applications));
  }, []);

  const deleteApplication = (application: Applications) => {
    // Create a new array that filters out the application to be deleted
    const updatedApplications = applications.filter(
      (app) => app.id !== application.id
    );

    // Update the state with the new array
    setApplications(updatedApplications);

    axios
      .delete("http://localhost:5000/api/applications/" + application.id)
      .catch((err) => console.log(err.message));
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
                    index >= currentIndex && index < currentIndex + visibleCards
                      ? "visible"
                      : ""
                  }`}
                >
                  <Cards applications={app} deleteHandler={deleteApplication} />
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
  );
}

export default Applications;
