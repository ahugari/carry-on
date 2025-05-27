// Update navigation path in handleNext
const handleNext = () => {
  if (!departureCity) setDepartureCityError('Departure city is required');
  if (!arrivalCity) setArrivalCityError('Arrival city is required');
  
  if (departureCity && arrivalCity && !departureCityError && !arrivalCityError && !dateError) {
    router.push({
      pathname: '/trip/new/step-2',
      params: {
        departureCity,
        arrivalCity,
        departureDate: departureDate.toISOString(),
        arrivalDate: arrivalDate.toISOString(),
        airline,
        flightNumber
      }
    });
  }
};