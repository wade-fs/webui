import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Slider from "components/Form/Slider";
import Select from "components/Form/Select";
import {
  AllowTile,
  Alias,
  IsMoveable,
  LinkedApp,
  LinkedAppName,
  LinkedAppDirectory,
  LinkedAppCommandOptions,
} from "const/Applications/ApplicationFieldNames";

export default class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appType: props.data[Alias] !== "" ? "Alias" : "Path",
    };
  }

  componentDidUpdate(prevProps) {
    // check cancel
    if (prevProps.data !== this.props.data) {
      const appType = this.props.data[Alias] !== "" ? "Alias" : "Path";
      this.setState({ appType: appType });
    }
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name === LinkedApp && e.target.value === "Desktop") {
      data[Alias] = "";
      data[LinkedAppName] = "";
      data[LinkedAppDirectory] = "";
      data[LinkedAppCommandOptions] = "";
    } else if (e.target.name === "PathType") {
      if (e.target.value === "Path") {
        data[Alias] = "";
      } else {
        data[LinkedAppDirectory] = "";
        data[LinkedAppName] = "";
      }
      this.setState({ appType: e.target.value });
    }
    onChange(data, true);
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
      state: { appType },
    } = this;
    const value = name === "PathType" ? appType : data[name];
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        options={{ value: value, ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { isLoaded, data },
      state: { appType },
    } = this;

    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField(
            "ALLOW APPLICATION TO BE TILED",
            AllowTile,
            { type: "slider" },
            Slider
          )}
          {/* {this.getWrapperField(
            "ALLOW APPLICATION TO BE MOVED",
            IsMoveable,
            { type: "slider" },
            Slider
          )} */}
          {this.getWrapperField(
            "DEPLOY",
            LinkedApp,
            {
              type: "select",
              options: ["Desktop", "Application"],
              value: data[LinkedApp],
            },
            Select
          )}
          {data.LinkedApp === "Application" && (
            <ul className="editor-content">
              {this.getWrapperField(
                "PATH TYPE",
                "PathType",
                { options: ["Path", "Alias"] },
                Select
              )}
              {/* {this.getTypeField("PATH TYPE", ["Path", "Alias"])} */}
            </ul>
          )}
          {data.LinkedApp === "Application" && appType === "Alias" && (
            <Fragment>
              {this.getWrapperField("ALIAS", Alias)}
              {this.getWrapperField(
                "COMMAND LINE OPTIONS",
                LinkedAppCommandOptions
              )}
            </Fragment>
          )}
          {data.LinkedApp === "Application" && appType === "Path" && (
            <Fragment>
              {this.getWrapperField("PROGRAM PATH", LinkedAppName)}
              {this.getWrapperField(
                "COMMAND LINE OPTIONS",
                LinkedAppCommandOptions
              )}
              {this.getWrapperField(
                "START IN THE FOLLOWING FOLDER",
                LinkedAppDirectory
              )}
            </Fragment>
          )}
        </ul>
      )
    );
  }
}
