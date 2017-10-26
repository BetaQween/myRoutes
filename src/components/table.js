import React, { Component } from "react";
import axios from "axios";
import Map from "./map";

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      markerAdding: false,
      selectedRouteName: ""
    };
  }

  componentWillMount() {
    axios
      .get("http://localhost:3001/allroutes")
      .then(res => {
        console.log(res.data.routes);
        this.setState({ routes: res.data.routes });
        console.log(this.state.routes);
      })
      .catch(error => console.log(error));
  }

  deleteMarker = (route, index) => {
    console.log(route);
    axios
      .delete("http://localhost:3001/markerRoutes/" + route._id)
      .then(res => {
        const routes = this.state.routes.filter((route, routeIndex) => {
          return routeIndex !== index;
        });
        this.setState({ routes });
      })
      .catch(error => console.log(error));
    console.log("delete " + route._id);
  };

  routeSelectHandler(routeMarkers, routeName) {
    this.setState({ markerAdding: false });
    console.log(routeMarkers);
    console.log(routeName);
    axios
      .post("http://localhost:3001/markerRoutes", {
        name: routeName,
        routes: routeMarkers
      })
      .then(response => {
        console.log(response.data);
      var routes = this.state.routes;
        routes.push(response.data);
        this.setState({ routes: routes });
      })
      .catch(error => {
        console.log(error);
      });
  }

  addRoute = () => {
    var selectedRouteName = prompt("Please enter route name", "El Camino");
    this.setState({ selectedRouteName: selectedRouteName });
    this.setState({ markerAdding: true });
  };

  render() {
      if (!this.state.markerAdding) {
      return (
        <div className="row">
          <div className="col-md-12">
            <button
              onClick={() => {
                this.addRoute();
              }}>
              Create new route
            </button>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Routes</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.routes.map((route, index) => (
                  <tr key={index}>
                    <td key={index + 1}>{route.name}</td>
                    <td key={index + 2}>
                      {route.routes.map((route, index) => {
                        return (
                          <ul key={index + 4}>
                            <div key={index + 5}>rout coords:</div>
                            <li key={index + 6}>lat:{route[0].lat}</li>
                            <li key={index + 7}>lon:{route[0].lon}</li>
                          </ul>
                        );
                      })}
                    </td>
                    <td key={index + 3}>
                      <button onClick={() => this.deleteMarker(route, index)}
                        className="glyphicon glyphicon-trash" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else
      return (
        <Map
          selectView
          name={this.state.selectedRouteName}
          routeSelectHandler={this.routeSelectHandler.bind(this)}
        />
      );
  }
}
