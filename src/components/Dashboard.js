import React, { Component } from "react";
import Loading from "./Loading";
import classnames from "classnames";
import Panel from "./Panel";

import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    value: getTotalPhotos,
  },
  {
    id: 2,
    label: "Total Topics",
    value: getTotalTopics,
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: getUserWithMostUploads,
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: getUserWithLeastUploads,
  },
];

class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: []
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        });
      });

  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  // instance method
  selectPanel(id) {
    // console.log("this: ", this);
    this.setState((previousState) => {
      return {
        focused: previousState.focused !== null 
        ? null 
        : id,
      }
    });
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = (
      this.state.focused
        ? data.filter((panel) => this.state.focused === panel.id)
        : data
    ).map((panel) => (
      <Panel
        key={panel.id}
        id={panel.id}
        label={panel.label}
        value={panel.value(this.state)}
        onSelect={() => this.selectPanel(panel.id)}
      />
    ));
    // console.log('data: ', data);
    // console.log("panels: ", panels);

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
