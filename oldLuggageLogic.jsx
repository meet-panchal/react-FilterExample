if (
  this.state.luggageFilter[0].isSelected &&
  this.state.luggageFilter[1].isSelected
) {
  for (let details in this.state.superData) {
    this.state.superData[details].infos.baggage_info.first_baggage_collection[0]
      .allowance <= 20
      ? luggageFilteredArray.push(this.state.superData[details])
      : luggageFilteredArray.push();
  }
  return luggageFilteredArray;
}
if (
  this.state.luggageFilter[0].isSelected &&
  !this.state.luggageFilter[1].isSelected
) {
  for (let details in this.state.superData) {
    this.state.superData[details].infos.baggage_info.first_baggage_collection[0]
      .allowance <= 15
      ? luggageFilteredArray.push(this.state.superData[details])
      : luggageFilteredArray.push();
  }
  return luggageFilteredArray;
}
if (
  !this.state.luggageFilter[0].isSelected &&
  this.state.luggageFilter[1].isSelected
) {
  for (let details in this.state.superData) {
    this.state.superData[details].infos.baggage_info.first_baggage_collection[0]
      .allowance > 15
      ? luggageFilteredArray.push(this.state.superData[details])
      : luggageFilteredArray.push();
  }
  return luggageFilteredArray;
}
