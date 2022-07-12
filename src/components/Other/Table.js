import React, { Fragment } from "react";
import { clone, defaultObject, objectEqual } from "lib/Util";
import { keyToClassNameMap } from "const/Consts";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    const data = props.options.data;
    this.state = {
      data: data == null ? defaultObject : clone(data),
    };
  }

  componentDidUpdate(prevProps) {
    if (!objectEqual(this.props.options.data, prevProps.options.data)) {
      if (this.props.options.data != null) {
        const data = this.props.options.data;
        this.setState({
          data: clone(data),
        });
      }
    }
  }

  onEdit = (idx) => {
    const { editCallback } = this.props.options;
    if (!!editCallback) editCallback(idx);
  };
  onDelete = (idx) => {
    const { deleteCallback } = this.props.options;
    if (!!deleteCallback) deleteCallback(idx);
  };

  getTableHeader() {
    if (this.state.data[0] == null) return;
    let canEdit = this.props.options.canEdit;
    let keys = Object.keys(this.state.data[0]);
    return (
      <ul className="bgcontainer bg-list">
        {keys.map((key) => (
          <li className={keyToClassNameMap[key]} key={key}>
            {key === "Action" ? "Status" : key}
          </li>
        ))}
        {canEdit && <li className="actions">ACTIONS</li>}
      </ul>
    );
  }
  getTableRow() {
    let data = this.state.data;
    if (data[0] == null) return;
    let keys = Object.keys(data[0]);
    let { canEdit } = this.props.options;
    return (
      <Fragment>
        {data.map((item, idx) => (
          <ul key={idx} className="bgcontainer">
            {keys.map((key) => (
              <li className={keyToClassNameMap[key]} key={key}>
                {item[key]}
              </li>
            ))}
            {canEdit && (
              <li>
                <div
                  className="action-edit-sm"
                  onClick={() => this.onEdit(idx)}
                ></div>
                <div
                  className="action-delete-sm"
                  onClick={() => this.onDelete(idx)}
                ></div>
              </li>
            )}
          </ul>
        ))}
      </Fragment>
    );
  }

  render() {
    return (
      <div className="select-model">
        {this.getTableHeader()}
        {this.getTableRow()}
      </div>
    );
  }
}
