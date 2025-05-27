// Update navigation path in handleNext
const handleNext = () => {
  const isValid = validateDimensions() && validateWeight() && validatePrice();
  
  if (isValid) {
    router.push({
      pathname: '/trip/new/step-3',
      params: {
        ...params,
        dimensions: JSON.stringify(dimensions),
        unit,
        weightLimit,
        weightUnit,
        itemCount,
        price,
        currency
      }
    });
  }
};