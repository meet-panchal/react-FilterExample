import React, { Component } from "react";
import wingieFilterJson from "../wingieFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import airportFilter from "../airportFilter";
import airlinesFilter from "../airlinesFilter";
import luggageFilter from "../luggageFilter";
import stoppageFilter from "../stoppageFilter";
import {
  faShoppingBag,
  faSuitcase,
  faPlaneDeparture,
  faPlane,
  faHotel
} from "@fortawesome/free-solid-svg-icons";
import "../Styles/SideBar.css";

let convertJSONToArray = () => {
  let convertedArray = [];
  for (let details in wingieFilterJson) {
    convertedArray.push(wingieFilterJson[details]);
  }
  return convertedArray;
};
let newArr = convertJSONToArray();

export default class SideBar extends Component {
  /*** State Initialization ***/
  state = {
    superData: wingieFilterJson,
    luggageFilteredArray: [],
    stoppageFilteredArray: [],
    airlineFilteredArray: [],
    airportFilteredArray: [],
    luggageFilter: luggageFilter,
    stoppageFilter: stoppageFilter,
    airlinesFilter: airlinesFilter,
    airportFilter: airportFilter,
    superFilteredData: []
  };

  /*** State End ***/

  /*** Luggage Filtration Process Starts ***/

  /*** This function filters out the current requirment from the main Object ***/
  luggageFilteration = luggageFilteredArray => {
    let tmpArray = [...luggageFilteredArray];
    let activeObject = this.state.luggageFilter.filter(
      item => item.isSelected === true
    );

    activeObject.map(currentobj => {
      for (let details of newArr) {
        details.infos.baggage_info.first_baggage_collection[0].allowance ===
        currentobj.value
          ? tmpArray.push(details)
          : tmpArray.push();
      }
      return currentobj;
    });
    return tmpArray;
  };

  /*** This functions updates the state on change of the checkbox state ***/
  changeLuggageState = luggageWeight => {
    let updatedLuggageState = this.state.luggageFilter.slice();
    updatedLuggageState.forEach(luggageState => {
      if (luggageState.value === luggageWeight) {
        luggageState.isSelected = !luggageState.isSelected;
      }
    });
    return updatedLuggageState;
  };

  /*** This function sets the state and calls "luggageFilteration" function  ***/

  luggageFilterate = async luggageWeight => {
    let luggageFilteredArray = [];
    let updatedState = this.changeLuggageState(luggageWeight);
    luggageFilteredArray = await this.luggageFilteration(luggageFilteredArray);
    this.setState({
      luggageFilter: updatedState,
      luggageFilteredArray: luggageFilteredArray,
      superFilteredData: luggageFilteredArray
    });
    console.log(luggageFilteredArray);
    return luggageFilteredArray.length > 0 ? luggageFilteredArray : null;
  };

  /*** Luggage Filtration Process Ends ***/

  /*** Stoppage Filteration Starts ***/

  stoppageFilteration = stoppageFilteredArray => {
    let activeObject = this.state.stoppageFilter.filter(
      item => item.isSelected === true
    );
    let chooseData =
      this.state.luggageFilteredArray.length > 0
        ? this.state.luggageFilteredArray
        : newArr;
    activeObject.map(currentobj => {
      for (let details of chooseData) {
        details.segments.length === currentobj.value + 1
          ? stoppageFilteredArray.push(details)
          : stoppageFilteredArray.push();
      }
      return currentobj;
    });
    return stoppageFilteredArray;
  };

  changeStoppageState = stoppage => {
    let updatedLuggageState = this.state.stoppageFilter.slice();
    updatedLuggageState.forEach(stoppageState => {
      if (stoppageState.value === stoppage) {
        stoppageState.isSelected = !stoppageState.isSelected;
      }
    });
    return updatedLuggageState;
  };

  stopsFilterate = async stoppage => {
    let stoppageFilteredArray = [];
    let finalResult = this.changeStoppageState(stoppage);
    stoppageFilteredArray = await this.stoppageFilteration(
      stoppageFilteredArray
    );
    this.setState({
      stoppageFilter: finalResult,
      stoppageFilteredArray: stoppageFilteredArray,
      superFilteredData: stoppageFilteredArray
    });
    console.log(stoppageFilteredArray);
    return stoppageFilteredArray.length > 0 ? stoppageFilteredArray : null;
  };

  /*** Stoppage Filteration Ends ***/

  /**
   * Airlines Filter starts
   */
  airlineFilteration = airlineFilteredArray => {
    let tmpArr = [...airlineFilteredArray];
    let activeObject = this.state.airlinesFilter.filter(
      item => item.isSelected === true
    );
    let chooseData = [];
    if (this.state.stoppageFilteredArray.length > 0) {
      chooseData = this.state.stoppageFilteredArray;
    } else if (this.state.luggageFilteredArray.length > 0) {
      chooseData = this.state.luggageFilteredArray;
    } else {
      chooseData = newArr;
    }
    activeObject.map(currentobj => {
      for (let details of chooseData) {
        details.segments.forEach(airline => {
          airline["operating_airline"] === currentobj.code
            ? tmpArr.push(details)
            : tmpArr.push();
        });
      }
      return currentobj;
    });
    return tmpArr;
  };

  changeAirlineState = airlineCode => {
    let updatedAirlineState = this.state.airlinesFilter.slice();
    updatedAirlineState.forEach(airlineState => {
      if (airlineState.code === airlineCode) {
        airlineState.isSelected = !airlineState.isSelected;
      }
    });
    return updatedAirlineState;
  };

  airlineFilterate = async airlineCode => {
    let airlineFilteredArray = [];
    let finalResult = this.changeAirlineState(airlineCode);
    airlineFilteredArray = await this.airlineFilteration(airlineFilteredArray);
    this.setState({
      airlinesFilter: finalResult,
      airlineFilteredArray: airlineFilteredArray,
      superFilteredData: airlineFilteredArray
    });
    console.log(airlineFilteredArray);
    return airlineFilteredArray.length > 0 ? airlineFilteredArray : null;
  };
  /**
   * Airlines Filter Ends
   */

  /**
   * Airports Filter Start
   */
  airportFilteration = airportFilteredArray => {
    let activeObject = this.state.airportFilter.filter(
      item => item.isSelected === true
    );
    let chooseData =
      this.state.airlineFilteredArray.length > 0
        ? this.state.airlineFilteredArray
        : this.state.stoppageFilteredArray.length > 0
        ? this.state.stoppageFilteredArray
        : this.state.luggageFilteredArray.length > 0
        ? this.state.luggageFilteredArray
        : newArr;
    activeObject.map(currentobj => {
      for (let details of chooseData) {
        details.segments.forEach(airport => {
          airport["origin"] === currentobj.airport_code ||
          airport["destination"] === currentobj.airport_code
            ? airportFilteredArray.push(details)
            : airportFilteredArray.push();
        });
      }
      return currentobj;
    });
    return airportFilteredArray;
  };

  changeAirportState = airportCode => {
    let updatedAirportState = this.state.airportFilter.slice();
    updatedAirportState.forEach(airportState => {
      if (airportState.airport_code === airportCode) {
        airportState.isSelected = !airportState.isSelected;
      }
    });
    return updatedAirportState;
  };

  airportFilterate = async airportCode => {
    let airportFilteredArray = [];
    let finalResult = this.changeAirportState(airportCode);
    airportFilteredArray = await this.airportFilteration(airportFilteredArray);
    this.setState({
      airportFilter: finalResult,
      airportFilteredArray: airportFilteredArray,
      superFilteredData: airportFilteredArray
    });
    console.log(airportFilteredArray);
    // return airportFilteredArray.length > 0 ? airportFilteredArray : null;
  };
  /**
   * Airports Filter End
   */
  render() {
    // this.convertJSONToArray();
    return (
      <div>
        <div>
          <ul className="filters">
            <li>
              <input
                type="checkbox"
                name="15kg"
                defaultChecked={this.state.luggageFilter[0].isSelected}
                onChange={_ => this.luggageFilterate(15)}
              />
              <FontAwesomeIcon icon={faShoppingBag} className="mx-3" />
              Carry-on
            </li>
            <li>
              <input
                type="checkbox"
                name="20kg"
                onChange={_ => this.luggageFilterate(20)}
                defaultChecked={this.state.luggageFilter[1].isSelected}
              />
              <FontAwesomeIcon icon={faSuitcase} className="mx-3" />
              Check-in baggage of 20 kg and over
            </li>
          </ul>
        </div>

        <div>
          <ul className="filters">
            <li>
              <input
                type="checkbox"
                defaultChecked={this.state.stoppageFilter[0].isSelected}
                onChange={_ => this.stopsFilterate(0)}
              />
              <FontAwesomeIcon icon={faPlaneDeparture} className="mx-3" />
              Non-Stop Flights
            </li>
            <li>
              <input
                type="checkbox"
                onChange={_ => this.stopsFilterate(1)}
                defaultChecked={this.state.stoppageFilter[1].isSelected}
              />
              <FontAwesomeIcon icon={faPlaneDeparture} className="mx-3" />
              Flights with 1 Stoppage
            </li>
            <li>
              <input
                type="checkbox"
                onChange={_ => this.stopsFilterate(2)}
                defaultChecked={this.state.stoppageFilter[2].isSelected}
              />
              <FontAwesomeIcon icon={faPlaneDeparture} className="mx-3" />
              Flights with 2 Stoppage
            </li>
          </ul>
        </div>

        <div>
          <ul className="filters">
            {this.state.airlinesFilter.map((item, index) => (
              <li key={item.code}>
                <input
                  type="checkbox"
                  defaultChecked={this.state.airlinesFilter[index].isSelected}
                  onChange={_ => this.airlineFilterate(item.code)}
                />
                <FontAwesomeIcon icon={faPlane} className="mx-3" />
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="filters">
            {this.state.airportFilter.map((item, index) => (
              <li key={item.airport_code}>
                <input
                  type="checkbox"
                  defaultChecked={this.state.airportFilter[index].isSelected}
                  onChange={_ => this.airportFilterate(item.airport_code)}
                />
                <FontAwesomeIcon icon={faHotel} className="mx-3" />
                {item.airport_name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="filters">
            {this.state.superFilteredData.map((item, index) => (
              <li key={item.airport_code}>{item.id}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
