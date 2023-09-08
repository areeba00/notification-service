// ApplicationPage.js (Higher-Order Component)
import React, { useState } from "react";
import Cards from "./Card/Card";
import Events from "../Events/Events";

const ApplicationPage = ({ applicationId }) => {
  // Maintain selected applicationId state
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  // Handle card click to update selected applicationId
  const handleCardClick = (appId) => {
    setSelectedApplicationId(appId);
  };

  return (
    <div>
      {/* Render Cards component with selectedApplicationId */}
      <Cards onSelectCard={handleCardClick} selectedApplicationId={selectedApplicationId} />
      
      {/* Conditionally render Events based on selectedApplicationId */}
      {selectedApplicationId !== null && (
        <Events applicationId={selectedApplicationId} />
      )}
    </div>
  );
};

export default ApplicationPage;
