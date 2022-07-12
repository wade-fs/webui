import React, { Fragment } from "react";
import { ItemField } from "components/Card";
import { CancelAndConfirm } from "components/Form/Button";
import DhcpOption from "./DhcpOption";
import {
  ipValid,
  isDefaultObject,
  isNotEmptyObject,
} from "../../../../lib/Util";

import {
  RangeIpStart,
  RangeIpEnd,
  SubnetMask,
  RouterIP,
  DEFAULT_DHCP,
} from "const/Setting/DHCP";

import { checkEdit, checkListEdit } from "utils/Check";

export default class DhcpInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:
        props.dhcpData.length > 0
          ? { ...props.dhcpData[props.dhcpIdx].RangeSet }
          : {},
      exclutions:
        props.dhcpData.length > 0
          ? [...props.dhcpData[props.dhcpIdx].Exclusions]
          : [],
      reservations:
        props.dhcpData.length > 0
          ? [...props.dhcpData[props.dhcpIdx].Reservations]
          : [],
      addCount: 0, // for key use
      rangeSetEdited: false,
      exclutionsEdited: false,
      reservationsEdited: false,
      errorFields: { RangeSet: {}, Exclusions: {}, Reservations: {} },
    };
  }

  componentDidUpdate(prevProps) {
    // check dhcp update
    if (
      prevProps.dhcpData !== this.props.dhcpData ||
      this.props.dhcpIdx !== prevProps.dhcpIdx ||
      this.props.isEditMode !== prevProps.isEditMode
    ) {
      if (this.props.dhcpIdx == null) {
        this.setState({
          data: { ...DEFAULT_DHCP.RangeSet },
          exclutions: JSON.parse(JSON.stringify(DEFAULT_DHCP.Exclusions)),
          reservations: JSON.parse(JSON.stringify(DEFAULT_DHCP.Reservations)),
        });
      } else {
        this.setState({
          data: { ...this.props.dhcpData[this.props.dhcpIdx].RangeSet },
          exclutions: JSON.parse(
            JSON.stringify(this.props.dhcpData[this.props.dhcpIdx].Exclusions)
          ),
          reservations: JSON.parse(
            JSON.stringify(this.props.dhcpData[this.props.dhcpIdx].Reservations)
          ),
        });
      }
      this.setState({
        rangeSetEdited: false,
        exclutionsEdited: false,
        reservationsEdited: false,
        errorFields: { RangeSet: {}, Exclusions: {}, Reservations: {} },
      });
    }
  }

  change = (e, optionIdx, optionType) => {
    let {
      props: { dhcpData, dhcpIdx, updateCanSwitch },
      state: {
        data,
        exclutions,
        reservations,
        rangeSetEdited,
        exclutionsEdited,
        reservationsEdited,
        errorFields,
      },
    } = this;

    if (optionIdx == null) {
      data[e.target.name] = e.target.value;
      if (dhcpIdx == null) {
        rangeSetEdited = checkEdit(data, DEFAULT_DHCP.RangeSet);
      } else {
        rangeSetEdited = checkEdit(data, dhcpData[dhcpIdx].RangeSet);
      }
      if (e.target.error) {
        errorFields.RangeSet[e.target.name] = e.target.error;
      } else {
        if (errorFields.RangeSet[e.target.name] != null)
          delete errorFields.RangeSet[e.target.name];
      }
      this.setState({ data, rangeSetEdited, errorFields });
    } else {
      let editId;
      if (optionType === "Exclusions") {
        editId = exclutions[optionIdx].Id;
        exclutions[optionIdx][e.target.name] = e.target.value;
        this.setState({ exclutions });
      } else if (optionType === "Reservations") {
        editId = reservations[optionIdx].Id;
        reservations[optionIdx][e.target.name] = e.target.value;
        this.setState({ reservations });
      }
      // check option error
      if (e.target.error) {
        if (errorFields[optionType][editId] == null)
          errorFields[optionType][editId] = {};
        errorFields[optionType][editId][e.target.name] = e.target.error;
      } else {
        if (
          errorFields[optionType][editId] != null &&
          errorFields[optionType][editId][e.target.name] != null
        )
          delete errorFields[optionType][editId][e.target.name];
        if (isDefaultObject(errorFields[optionType][editId])) {
          delete errorFields[optionType][editId];
        }
      }
      this.setState({ errorFields }, () => {
        this.checkOptionEdit(optionType);
      });
    }
    updateCanSwitch(
      rangeSetEdited === false &&
        exclutionsEdited === false &&
        reservationsEdited === false
    );
  };

  checkOptionEdit = (optionType) => {
    let {
      props: { dhcpData, dhcpIdx },
      state: { exclutions, reservations, exclutionsEdited, reservationsEdited },
    } = this;
    if (optionType === "Exclusions") {
      if (dhcpIdx == null) {
        exclutionsEdited = checkListEdit(exclutions, DEFAULT_DHCP.Exclusions);
      } else {
        exclutionsEdited = checkListEdit(
          exclutions,
          dhcpData[dhcpIdx].Exclusions
        );
      }
      this.setState({ exclutionsEdited });
    } else if (optionType === "Reservations") {
      if (dhcpIdx == null) {
        reservationsEdited = checkListEdit(
          reservations,
          DEFAULT_DHCP.Reservations
        );
      } else {
        reservationsEdited = checkListEdit(
          reservations,
          dhcpData[dhcpIdx].Reservations
        );
      }
      this.setState({ reservationsEdited });
    }
  };

  onApply = async () => {
    let {
      props: { onApply },
      state: {
        data,
        exclutions,
        reservations,
        rangeSetEdited,
        exclutionsEdited,
        reservationsEdited,
      },
    } = this;
    const convertExclusions = exclutions.map((item) => {
      if (typeof item.Id === "string")
        return {
          ...item,
          Id: 0,
        };
      return item;
    });
    const convertReservations = reservations.map((item) => {
      if (typeof item.Id === "string")
        return {
          ...item,
          Id: 0,
        };
      return item;
    });
    const updateData = {
      RangeSet: data,
      Exclusions: convertExclusions,
      Reservations: convertReservations,
    };
    this.setState({
      errorFields: { RangeSet: {}, Exclusions: {}, Reservations: {} },
    });
    onApply(updateData, rangeSetEdited, exclutionsEdited, reservationsEdited);
  };

  deleteOption = (optionType, option, idx) => {
    let {
      state: { exclutions, reservations, errorFields },
    } = this;
    if (optionType === "Exclusions") {
      exclutions.splice(idx, 1);
      this.setState({ exclutions });
    } else if (optionType === "Reservations") {
      reservations.splice(idx, 1);
      this.setState({ reservations });
    }
    delete errorFields[optionType][option.Id];
    this.setState({ errorFields }, () => {
      this.checkOptionEdit(optionType);
    });
  };
  addOption = (optionType) => {
    let {
      props: { dhcpData, dhcpIdx },
      state: { exclutions, reservations, errorFields, addCount },
    } = this;
    const dhcpId = dhcpIdx != null ? dhcpData[dhcpIdx].RangeSet.Id : 0;
    addCount++;
    if (optionType === "Exclusions") {
      exclutions.push({
        Id: "new_" + addCount,
        Rid: dhcpId,
        ExStartIp: "",
        ExEndIp: "",
      });
      this.setState({ exclutions });
    } else if (optionType === "Reservations") {
      reservations.push({
        Id: "new_" + addCount,
        Rid: dhcpId,
        MacAddress: "",
        StaticIp: "",
      });
      this.setState({ reservations });
    }
    errorFields[optionType]["new_" + addCount] = {};
    this.setState({ addCount, errorFields }, () => {
      this.checkOptionEdit(errorFields);
    });
  };

  getWrapperField(
    title,
    name,
    options = {
      type: "text",
      placeholder: "192.168.0.1",
    }
  ) {
    let {
      props: { isEditMode },
      state: { data, errorFields },
    } = this;
    return (
      <li>
        <label>{title}</label>
        <ItemField
          title={title}
          name={name}
          isEditMode={isEditMode}
          options={{
            value: data[name],
            className: "w-120",
            error: errorFields.RangeSet[name],
            required: true,
            validator: ipValid,
            ...options,
          }}
          onChange={this.change}
        />
      </li>
    );
  }

  render() {
    let {
      props: { isEditMode, onCancel, onDelete, onEdit, dhcpData, dhcpIdx },
      state: {
        exclutions,
        reservations,
        rangeSetEdited,
        exclutionsEdited,
        reservationsEdited,
        errorFields,
      },
    } = this;
    const edited = rangeSetEdited || exclutionsEdited || reservationsEdited;
    const hasError =
      isNotEmptyObject(errorFields.RangeSet) ||
      isNotEmptyObject(errorFields.Exclusions) ||
      isNotEmptyObject(errorFields.Reservations);
    const canApply = !hasError && edited;
    return (
      <div className="setting-editor" data-view={!isEditMode}>
        <header className="title">
          <h3>
            {dhcpIdx != null ? (
              <Fragment>
                {dhcpData[dhcpIdx].RangeSet.RangeIpStart}
                <div className="dhcp-arrow-green-icon"></div>
                {dhcpData[dhcpIdx].RangeSet.RangeIpEnd}
              </Fragment>
            ) : (
              "Create New DHCP"
            )}
          </h3>
          {!isEditMode && dhcpIdx != null && (
            <div className="flex">
              <div className="setting-delete-icon" onClick={onDelete}></div>
              <div className="setting-edit-icon" onClick={onEdit}></div>
            </div>
          )}
        </header>
        <div className="content">
          <h4>
            IP Range <span> *</span>
          </h4>
          <ul className="dhcp-input-fields">
            {this.getWrapperField("Starting IP Address", RangeIpStart)}
            {this.getWrapperField("Ending IP Address", RangeIpEnd)}
            {this.getWrapperField("Subnet Mask", SubnetMask, {
              placeholder: "255.255.255.0",
            })}
            {this.getWrapperField("Router IP Address", RouterIP)}
          </ul>
        </div>
        <div className="row-contents">
          <DhcpOption
            isEditMode={isEditMode}
            optionType="Exclusions"
            data={exclutions}
            errorFields={errorFields.Exclusions}
            onChange={this.change}
            onAdd={this.addOption}
            onDelete={this.deleteOption}
          />
          <DhcpOption
            isEditMode={isEditMode}
            optionType="Reservations"
            data={reservations}
            errorFields={errorFields.Reservations}
            onChange={this.change}
            onAdd={this.addOption}
            onDelete={this.deleteOption}
          />
        </div>
        {isEditMode && (
          <CancelAndConfirm
            type="APPLY"
            canConfirm={canApply}
            onConfirm={this.onApply}
            onCancel={onCancel}
          />
        )}
      </div>
    );
  }
}
