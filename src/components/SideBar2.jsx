import React, { Component } from "react";
import wingieFilterJson from "../wingieFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import airportFilter from "../airportFilter";
import airlinesFilter from "../airlinesFilter";
import luggageFilter from "../luggageFilter";
import stoppageFilter from "../stoppageFilter";
import {
  faSuitcase,
  faPlaneDeparture,
  faPlane,
  faHotel
} from "@fortawesome/free-solid-svg-icons";
import "../Styles/SideBar.css";

let localState = {
  luggageFilter: luggageFilter,
  stoppageFilter: stoppageFilter,
  airlinesFilter: airlinesFilter,
  airportFilter: airportFilter
};
let convertJSONToArray = () => {
  let convertedArray = [];
  for (let details in wingieFilterJson) {
    convertedArray.push(wingieFilterJson[details]);
  }
  return convertedArray;
};
let arrayData = convertJSONToArray();

export default class SideBar2 extends Component {
  state = {
    finalFilteredData: []
  };

  filterByLuggage = mainArr => {
    let tmpArray = [];
    let activeObject = localState.luggageFilter.filter(
      item => item.isSelected === true
    );

    if (activeObject.length > 0) {
      activeObject.map(currentobj => {
        for (let details of mainArr) {
          details.infos.baggage_info.first_baggage_collection[0].allowance ===
          currentobj.value
            ? tmpArray.push(details)
            : tmpArray.push();
        }
        return currentobj;
      });
      return tmpArray;
    } else {
      return mainArr;
    }
  };

  filterByStoppage = mainArr => {
    let tmpArray = [];
    let activeObject = localState.stoppageFilter.filter(
      item => item.isSelected === true
    );
    if (activeObject.length > 0) {
      activeObject.map(currentobj => {
        for (let details of mainArr) {
          details.segments.length === currentobj.value + 1
            ? tmpArray.push(details)
            : tmpArray.push();
        }
        return currentobj;
      });
      return tmpArray;
    } else {
      return mainArr;
    }
  };

  filterByAirline = mainArr => {
    let tmpArray = [];
    let activeObject = localState.airlinesFilter.filter(
      item => item.isSelected === true
    );
    if (activeObject.length > 0) {
      activeObject.map(currentobj => {
        for (let details of mainArr) {
          details.segments.forEach(airline => {
            if (airline["operating_airline"] === currentobj.code) {
              tmpArray.push(details);
            }
          });
        }
        return currentobj;
      });
      return tmpArray;
    } else {
      return mainArr;
    }
  };
  filterByAirport = mainArr => {
    let tmpArray = [];
    let activeObject = localState.airportFilter.filter(
      item => item.isSelected === true
    );
    if (activeObject.length > 0) {
      activeObject.map(currentobj => {
        for (let details of mainArr) {
          details.segments.forEach(airport => {
            if (
              airport["origin"] === currentobj.airport_code ||
              airport["destination"] === currentobj.airport_code
            ) {
              tmpArray.push(details);
            }
          });
        }
        return currentobj;
      });
      return tmpArray;
    } else {
      return mainArr;
    }
  };

  getFilteredFlights = () => {
    const luggageFilteredArray = this.filterByLuggage(arrayData);

    const stoppageFilteredArray = this.filterByStoppage(luggageFilteredArray);

    const airlineFilteredArray = this.filterByAirline(stoppageFilteredArray);
    const airportFilteredArray = this.filterByAirport(airlineFilteredArray);

    this.setState({
      finalFilteredData: airportFilteredArray
    });
  };

  checkboxChangeHandler = (event, item) => {
    switch (event.target.attributes.datatype.value) {
      case "luggage":
        let weight = item.value;
        let updatedLuggageState = luggageFilter.slice();
        updatedLuggageState.forEach(luggageState => {
          if (luggageState.value === weight) {
            luggageState.isSelected = !luggageState.isSelected;
          }
        });
        localState.luggageFilter = updatedLuggageState;
        this.getFilteredFlights();
        break;

      case "stoppage":
        let stoppage = item.value;
        let updatedStoppageState = stoppageFilter.slice();
        updatedStoppageState.forEach(stoppageState => {
          if (stoppageState.value === stoppage) {
            stoppageState.isSelected = !stoppageState.isSelected;
          }
        });
        localState.stoppageFilter = updatedStoppageState;
        this.getFilteredFlights();
        break;

      case "airline":
        let airlineCode = item.code;
        let updatedAirlineState = airlinesFilter.slice();
        updatedAirlineState.forEach(airlineState => {
          if (airlineState.code === airlineCode) {
            airlineState.isSelected = !airlineState.isSelected;
          }
        });
        localState.airlinesFilter = updatedAirlineState;
        this.getFilteredFlights();
        break;
      case "airport":
        let airportCode = item.airport_code;
        let updatedAirportState = airportFilter.slice();
        updatedAirportState.forEach(airportState => {
          if (airportState.airport_code === airportCode) {
            airportState.isSelected = !airportState.isSelected;
          }
        });
        localState.airportFilter = updatedAirportState;
        this.getFilteredFlights();
        break;

      default:
        break;
    }
  };

  render() {
    return (
      <div>
        <div>
          <ul className="filters">
            {localState.luggageFilter.map((item, index) => (
              <li key={item.value}>
                <input
                  type="checkbox"
                  name={item.value}
                  datatype="luggage"
                  defaultChecked={localState.luggageFilter[index].isSelected}
                  onChange={event =>
                    this.checkboxChangeHandler(event, item, index)
                  }
                />
                <FontAwesomeIcon icon={faSuitcase} className="mx-3" />
                {item.value}kg
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="filters">
            {localState.stoppageFilter.map((item, index) => (
              <li key={item.value}>
                <input
                  type="checkbox"
                  name={item.value}
                  datatype="stoppage"
                  defaultChecked={localState.stoppageFilter[index].isSelected}
                  onChange={event =>
                    this.checkboxChangeHandler(event, item, index)
                  }
                />
                <FontAwesomeIcon icon={faPlaneDeparture} className="mx-3" />
                {item.value} Stoppage
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="filters">
            {localState.airlinesFilter.map((item, index) => (
              <li key={item.code}>
                <input
                  type="checkbox"
                  defaultChecked={localState.airlinesFilter[index].isSelected}
                  name={item.code}
                  datatype="airline"
                  onChange={event =>
                    this.checkboxChangeHandler(event, item, index)
                  }
                />
                <FontAwesomeIcon icon={faPlane} className="mx-3" />
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="filters">
            {localState.airportFilter.map((item, index) => (
              <li key={item.airport_code}>
                <input
                  type="checkbox"
                  name={item.airport_code}
                  datatype="airport"
                  defaultChecked={localState.airportFilter[index].isSelected}
                  onChange={event =>
                    this.checkboxChangeHandler(event, item, index)
                  }
                />
                <FontAwesomeIcon icon={faHotel} className="mx-3" />
                {item.airport_name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="filters">
            {this.state.finalFilteredData.map((item, index) => (
              <li key={item.id}>{item.id}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
