import React, { Fragment } from "react";
import Search from "components/Other/Search";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";
import { loadAdUsers } from "actions/OtherActions";

export default class SearchUser extends React.Component {
  constructor(props) {
    super(props);
    const adUsers =
      props?.data?.data != null
        ? JSON.parse(JSON.stringify(props?.data?.data))
        : [];
    this.state = {
      isAdServerLogin: true,
      adUsers: adUsers,
      selectedIdx: -1,
      selectedLocation: "All",
      searchText: "",
      startWith: false,
      contain: true,
      locations: this.getLocations(props.data.data),
    };
  }

  componentDidMount() {
    let { dispatch, outSideData } = this.props;
    dispatch(loadAdUsers("terminals.adUsers", outSideData));
  }

  componentDidUpdate(prevProps, prevState) {
    let { data } = this.props;
    if (prevProps.data !== this.props.data) {
      this.setState({
        adUsers:
          data?.data != null ? JSON.parse(JSON.stringify(data?.data)) : [],
        locations: this.getLocations(data.data),
      });
    }
  }

  getLocations = (data) => {
    let locations = new Set();
    if (data !== undefined && data.length > 0 && data !== "null") {
      data.forEach((item) => {
        if (!locations.has(item["Dn"])) {
          const location = item["Dn"];
          locations.add(location);
        }
      });
      return [...locations];
    }
    return [];
  };

  changeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onConfirmPassword = () => {
    let {
      props: { dispatch },
      state: { adServerPassword },
    } = this;
    const data = {
      Password: adServerPassword,
    };
    dispatch(loadAdUsers("terminals.adUsers", data));
    this.setState({ isAdServerLogin: true });
  };
  changeLocation = (e) => {
    const selectedLocation = e.target.value;
    this.setState({ selectedLocation: selectedLocation }, () =>
      this.updateAdUsers()
    );
  };
  onClick = (idx) => {
    this.setState({
      selectedIdx: idx,
    });
  };
  onConfirm = () => {
    let {
      props: { onConfirm },
      state: { adUsers, selectedIdx },
    } = this;
    if (selectedIdx == -1) return;
    let username = adUsers[selectedIdx]["Name"];
    let domain = adUsers[selectedIdx]["Dn"];
    onConfirm(username, domain);
  };
  setSearchText = (searchText) => {
    this.setState({ searchText: searchText }, () => this.updateAdUsers());
  };
  toggleContainAndStartWith = () => {
    this.setState(
      { startWith: !this.state.startWith, contain: !this.state.contain },
      () => this.updateAdUsers()
    );
  };

  updateAdUsers = () => {
    let {
      props: { data },
      state: { adUsers, selectedLocation, searchText, startWith, contain },
    } = this;
    const oriUser = data?.data ?? [];
    let filterAdUsers;
    if (selectedLocation != "All") {
      filterAdUsers = oriUser.filter((item) => item["Dn"] === selectedLocation);
    } else {
      filterAdUsers = [...oriUser];
    }
    if (searchText.length > 0) {
      if (startWith) {
        filterAdUsers = filterAdUsers.filter(
          (item) =>
            item["Name"].startsWith(searchText) ||
            item["Email"].startsWith(searchText)
        );
      } else if (contain) {
        filterAdUsers = filterAdUsers.filter(
          (item) =>
            item["Name"].includes(searchText) ||
            item["Email"].includes(searchText)
        );
      }
    }
    this.setState({
      adUsers: filterAdUsers,
      selectedIdx: -1,
    });
  };

  render() {
    let showModal = true;
    let {
      props: { onClose, onConfirm, data },
      state: {
        isAdServerLogin,
        adUsers,
        adServerPassword,
        selectedIdx,
        searchText,
        selectedLocation,
        startWith,
        contain,
        locations,
      },
    } = this;
    let names = [];
    let emails = [];
    if (adUsers !== undefined && adUsers.length > 0 && adUsers !== "null") {
      adUsers.forEach((item) => {
        names.push(item["Name"]);
        emails.push(item["Email"]);
      });
    }

    return (
      <Modal id="aduser-modal" show={showModal}>
        <Modal.Body>
          <div className="pop-up-window ">
            {!isAdServerLogin ? (
              <Fragment>
                <h2 className="mb-22">INPUT PASSWORD</h2>
                <div className="ml-40">
                  <label>
                    Ad Server Password <span style={{ color: "red" }}>*</span>
                    <input
                      type="password"
                      name="adServerPassword"
                      className="w-180"
                      onChange={this.changeInput}
                    />
                  </label>
                </div>
                <CancelAndConfirm
                  canConfirm={
                    adServerPassword != null && adServerPassword !== ""
                  }
                  onConfirm={this.onConfirmPassword}
                  onCancel={onClose}
                />
              </Fragment>
            ) : (
              <Fragment>
                <h2 className="mb-22">SEARCH FOR AD USER</h2>
                <label>Location</label>
                <div className="mt-8 mb-24">
                  <select
                    name="Location"
                    className="wp-100 h-32"
                    onChange={this.changeLocation}
                    value={selectedLocation}
                  >
                    <option value="All">All</option>
                    {locations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <section className="flex mt-8 mb-16">
                  <Search
                    value={searchText}
                    setSearchText={this.setSearchText}
                    inputClass="searchbar w-240"
                    placeholder="Search AD Users"
                  />
                  <p
                    className={contain ? "filter-btn bar-click" : "filter-btn"}
                    onClick={this.toggleContainAndStartWith}
                  >
                    CONTAIN
                  </p>
                  <p
                    className={
                      startWith ? "filter-btn bar-click" : "filter-btn"
                    }
                    onClick={this.toggleContainAndStartWith}
                  >
                    START WITH
                  </p>
                </section>
                <div className="section">
                  <div className="section_title">
                    <h3 className="left shortwidth">NAME</h3>
                    <h3 className="longwidth">USER PRINCIPAL NAME</h3>
                  </div>
                  <ul className="section_left shortwidth">
                    {adUsers.map((item, idx) => (
                      <li
                        key={item}
                        className={selectedIdx == idx ? "click" : ""}
                        onClick={() => this.onClick(idx)}
                      >
                        {item.Name}
                      </li>
                    ))}
                  </ul>
                  <ul className="section_right longwidth">
                    {adUsers.map((item, idx) => (
                      <li
                        key={item}
                        className={selectedIdx == idx ? "click" : ""}
                        onClick={() => this.onClick(idx)}
                      >
                        {item.Dn}
                      </li>
                    ))}
                  </ul>
                </div>
                <CancelAndConfirm
                  canConfirm={adUsers.length > 0}
                  onConfirm={this.onConfirm}
                  onCancel={onClose}
                />
              </Fragment>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
