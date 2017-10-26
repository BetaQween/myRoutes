import CesiumGlobe from "./../cesium/CesiumGlobe";
import React, { Component } from "react";
import axios from "axios";
import markerLogo from "./../markerLogo.png";

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: []
    };
    this.deleteMarker = this.deleteMarker.bind(this);
  }
  componentWillMount() {
    if (!this.props.selectView) {
      axios
        .get("http://localhost:3001/alldestinations")
        .then(res => {
          var markers = this.state.markers;
          var result = res.data.destinations;
          result.map((marker, i) => markers.push(marker));
          this.setState({ markers: markers });
        })
        .catch(error => console.log(error));
    }
  }

  handleLeftClick = coords => {
    console.log("Left mouse clicked at: ", coords);
    if (!this.props.selectView) {
      axios
        .post("http://localhost:3001/destination", {
          lon: coords.lon,
          lat: coords.lat,
          image: markerLogo
        })
        .then(res => {
          var markers = this.state.markers;
          markers.push(res.data);
          this.setState({ markers });
          console.log(res.data);
        })
        .catch(error => console.log(error));
    }else{
      // var line = this.state.line;
      // coords.alt = 20000;
      // line.push(coords);
      // this.setState({ line });
      var markers = this.state.markers;
      coords.image = markerLogo;
      markers.push(coords);
      this.setState({ markers });

    }
  };

  deleteMarker = (marker, index) => {
    console.log(marker);
    axios
      .delete("http://localhost:3001/destination/" + marker._id)
      .then(res => {
        //state deleteMarker
        const markers = this.state.markers.filter((marker, markerIndex) => {
          return markerIndex !== index;
        });
        this.setState({ markers });
      })
      .catch(error => console.log(error));
    console.log("delete " + marker._id);
  };

  renderMarkers() {
    if (!this.props.selectView) {
      return this.state.markers.map((marker, index) => (
        <li style={{ color: "white" }} key={index}>
          {marker.lat} {marker.lon}
          <button
            className="glyphicon glyphicon-trash"
            onClick={() => {
              this.deleteMarker(marker, index);
            }}
            key={marker}
          />
        </li>
      ));
    }
  }
  renderPrompt() {
    if (this.props.selectView) {
      return (
        <p>
          Please Select route for {this.props.name}
          <br></br>
          and click Save
          <br></br>
          <button
            onClick={() => this.handleSubmit()}
            className="btn btn-default"
          >
          Save
          </button>
        </p>
      );
    }
  }

  handleSubmit() {
    this.props.routeSelectHandler(this.state.markers, this.props.name);
  }

  render() {
    const { markers } = this.state;

    const containerStyle = {
      width: "100%",
      height: "100%",
      top: 50,
      left: 0,
      bottom: 0,
      right: 150,
      position: "fixed"
    };

    const icons = markers;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-8">
                <div style={containerStyle}>
                  <CesiumGlobe
                    icons={icons}
                    onLeftClick={this.handleLeftClick}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: "20px"
                  }}>
                  {this.renderPrompt()}
                </div>
                <ul style={{ position: "fixed", top: 100, textAlign: "right" }}>
                  {this.renderMarkers()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
