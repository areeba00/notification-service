import { useState } from "react";

const States = () => {
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [clikcedCardID, setClickedCardID] = useState<number>(0);

  const [selectedItems, setSelectedItems] = useState<number | null>(null);

  return {
    selectedApplicationId,
    setSelectedApplicationId,
    selectedEventId,
    setSelectedEventId,
    clikcedCardID,
    setClickedCardID,
    selectedItems,
    setSelectedItems,
  };
};

export default States;
