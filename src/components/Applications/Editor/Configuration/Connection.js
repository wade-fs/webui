import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Slider from "components/Form/Slider";
import {
  MaintainSession,
  StartSession,
  DisconnectInBackground,
  AllowAutoLogin,
} from "const/Applications/ApplicationFieldNames";

export default class Connection extends React.Component {
  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    onChange(data, true);
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { isLoaded },
    } = this;

    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField(
            "ALWAYS MAINTAIN A CONNECTION",
            MaintainSession,
            { type: "slider" },
            Slider
          )}
          {this.getWrapperField(
            "CONNECT AT BOOT-UP",
            StartSession,
            { type: "slider" },
            Slider
          )}
          {this.getWrapperField(
            "DISCONNECT IN THE BACKGROUND",
            DisconnectInBackground,
            { type: "slider" },
            Slider
          )}
          {this.getWrapperField(
            "ALLOW USER TO AUTO LOGIN",
            AllowAutoLogin,
            { type: "slider" },
            Slider
          )}
        </ul>
      )
    );
  }
}
