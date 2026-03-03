function formatItinerary(aiDays) {
  if (!Array.isArray(aiDays)) return [];

  return aiDays.map((dayObj, index) => {
    const allPlaces = [
      ...(dayObj.morning || []),
      ...(dayObj.afternoon || []),
      ...(dayObj.evening || [])
    ];

    return {
      day: dayObj.day || index + 1,

      hotel: {
        name: "",
        address: "",
      },

      places: allPlaces
    };
  });
}

module.exports = formatItinerary;