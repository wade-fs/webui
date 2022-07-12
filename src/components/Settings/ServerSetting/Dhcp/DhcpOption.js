import React, { Fragment } from "react";
import { ItemField } from "components/Card";
import {
  ipValidRealTime,
  macValidRealTime,
} from "../../../../lib/Util/Validator";

import { MAC_ADDRESS } from "const/Consts";
import {
  ExStartIp,
  ExEndIp,
  MacAddress,
  SubMacAddress,
  StaticIp,
} from "const/Setting/DHCP";

export default class DhcpOption extends React.Component {
  constructor(props) {
    super(props);
  }

  getWrapperField(
    title,
    name,
    idx,
    options = {
      type: "text",
      placeholder: "192.168.0.1",
    }
  ) {
    let {
      props: { data, optionType, onChange, isEditMode, errorFields },
    } = this;
    const item = data[idx];
    return (
      <ItemField
        title={title}
        name={name}
        isEditMode={isEditMode}
        options={{
          value: item[name],
          className: name === MacAddress ? "w-136" : "w-120" + " mr-12",
          error: errorFields[item.Id] != null ? errorFields[item.Id][name] : "",
          validator: name === MacAddress ? macValidRealTime : ipValidRealTime,
          required: true,
          ...options,
        }}
        onChange={(e) => onChange(e, idx, optionType)}
      />
    );
  }

  render() {
    let {
      props: { data, optionType, isEditMode, onAdd, onDelete },
    } = this;

    return (
      <div className="content">
        <h4>
          {optionType}
          <div
            className="editor-add"
            data-hidden={!isEditMode}
            onClick={() => onAdd(optionType)}
          ></div>
        </h4>
        {optionType === "Exclusions" && (
          <Fragment>
            <div className="table-column">
              <label>Starting IP Address</label>
              <ul className={!isEditMode ? "mt-10" : ""}>
                {data.map((item, idx) => (
                  <li key={idx}>
                    {this.getWrapperField(
                      "Starting IP Address",
                      ExStartIp,
                      idx
                    )}
                    {/* <div className="dhcp-arrow-gray-icon"></div> */}
                  </li>
                ))}
              </ul>
            </div>
            <div className="table-column">
              <label>Ending IP Address</label>
              <ul className={!isEditMode ? "mt-10" : ""}>
                {data.map((item, idx) => (
                  <li key={idx}>
                    {this.getWrapperField("Ending IP Address", ExEndIp, idx)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="table-column" data-actions>
              <label data-hidden={!isEditMode}>ACTIONS</label>
              <ul className={!isEditMode ? "mt-10" : ""}>
                {data.map((item, idx) => (
                  <li key={item.Id}>
                    <div
                      className="action-delete-sm"
                      data-hidden={!isEditMode}
                      onClick={() => onDelete(optionType, item, idx)}
                    ></div>
                  </li>
                ))}
              </ul>
            </div>
          </Fragment>
        )}
        {optionType === "Reservations" && (
          <Fragment>
            <div className="table-column">
              <label>{MAC_ADDRESS}</label>
              <ul className={!isEditMode ? "mt-10" : ""}>
                {data.map((item, idx) => (
                  <li key={idx}>
                    {this.getWrapperField(MAC_ADDRESS, MacAddress, idx)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="table-column">
              <label>IP Address</label>
              <ul className={!isEditMode ? "mt-10" : ""}>
                {data.map((item, idx) => (
                  <li key={item.Id}>
                    {this.getWrapperField("IP Address", StaticIp, idx)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="table-column" data-actions>
              <label data-hidden={!isEditMode}>ACTIONS</label>
              <ul className={!isEditMode ? "mt-10" : ""}>
                {data.map((item, idx) => (
                  <li key={idx}>
                    <div
                      className="action-delete-sm"
                      data-hidden={!isEditMode}
                      onClick={() => onDelete(optionType, idx)}
                    ></div>
                  </li>
                ))}
              </ul>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
