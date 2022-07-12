import React, { Fragment } from "react";
import { Title } from "components/Card";

import {
  Name,
  PossibleModuleSetting,
  Setting,
  Description,
  Key,
  Value,
  Type,
} from "const/Terminals/TerminalFieldNames";

export default class ModuleTable extends React.Component {
  // Get data object from key value list
  getUiData(module) {
    let data = {};
    module[Setting].forEach((item) => {
      data[item[Key]] = item[Value];
    });
    return data;
  }
  getWrapperField(title, key, value, type) {
    const data = this.getUiData(this.props.data);
    let showValue = data[key];
    if (type == "Switch") {
      if (showValue === true || showValue == "true") {
        showValue = "YES";
      } else if (showValue === false || showValue == "false") {
        showValue = "NO";
      }
    }
    return (
      <li key={key}>
        <label>{title}</label>
        <p data-view> {showValue}</p>
      </li>
    );
  }

  render() {
    let {
      props: { isEditMode, data, openEditor, trash },
    } = this;
    let columnLength = parseInt(data[PossibleModuleSetting].length / 3) + 1;

    return (
      <div className="wrap-960 wrap-bg-w">
        <div className="item-actions">
          {isEditMode && (
            <div className="action-edit-sm" onClick={openEditor}></div>
          )}
          {isEditMode && (
            <div className="action-delete-sm" onClick={trash}></div>
          )}
        </div>
        <Title title={data[Name]} />
        <div className="clearfix">
          <ul className="editor-content">
            {data[PossibleModuleSetting].slice(0, columnLength).map((item) =>
              this.getWrapperField(
                item[Description],
                item[Key],
                item[Value],
                item[Type]
              )
            )}
          </ul>
          <ul className="editor-content">
            {data[PossibleModuleSetting].slice(
              columnLength,
              columnLength * 2
            ).map((item) =>
              this.getWrapperField(
                item[Description],
                item[Key],
                item[Value],
                item[Type]
              )
            )}
          </ul>
          <ul className="editor-content">
            {data[PossibleModuleSetting].slice(columnLength * 2).map((item) =>
              this.getWrapperField(
                item[Description],
                item[Key],
                item[Value],
                item[Type]
              )
            )}
          </ul>
        </div>
      </div>
    );
  }
}
