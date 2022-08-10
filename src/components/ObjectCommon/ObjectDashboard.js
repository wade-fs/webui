import React, { Fragment } from "react";
import classNames from "classnames";

import { TerminalObject, ServerObject, ApplicationObject, VncObject } from "const/Consts";
import { getObjectProperty, stringValid, clone } from "lib/Util";
import Search from "components/Other/Search";
import ObjectTitles from "./ObjectTitles";

import { showInfoBar } from "actions/InfobarActions";

import { deleteObjects } from "utils/Object";

const DefaultState = {
  searchText: "",
  filterActive: null,
  filterEnable: null,
  filterFavorite: false,
  filterError: false,
};
const SortType = ["Sort by", "A~Z", "Latest"];

export default class ObjectDashboard extends React.Component {
  state = {
    selected: {},
    sortByName: true,
    showExpand: false,
    ...DefaultState,
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.editorOpened !== this.props.editorOpened ||
      prevProps.wizardOpened !== this.props.wizardOpened
    ) {
      this.setState({ selected: {} });
    }
  }

  setSearchText = (text) => {
    this.setState({ searchText: text });
  };
  click = (id, isGroup) => {
    this.props.openEditor(id, isGroup);
  };
  select = (id) => {
    let selected = clone(this.state.selected);
    selected[id] = !this.state.selected[id];
    this.setState({ selected: selected });
  };

  changeFilter = (currentValue, targetValue, name) => {
    if (name === "filterFavorite") {
      if (!currentValue) {
        this.setState({
          [name]: currentValue === targetValue ? currentValue : targetValue,
        });
      }
      if (currentValue === true) {
        this.setState({
          filterFavorite: false,
        });
      }
    } else if (name === "filterError") {
      if (!currentValue) {
        this.setState({
          [name]: currentValue === targetValue ? currentValue : targetValue,
        });
      }
      if (currentValue === true) {
        this.setState({
          filterError: false,
        });
      }
    } else {
      this.setState({
        [name]: currentValue === targetValue ? currentValue : targetValue,
      });
    }
  };

  onChangeSortType = (e) => {
    this.setState({
      sortByName: e.target.value === "A~Z" ? true : false,
    });
  };

  toggleShow = () => {
    let {
      state: { showExpand },
    } = this;
    showExpand = !showExpand;
    this.setState({ showExpand });
  };

  multiDelete = async (...args) => {
    let {
      state: { selected },
    } = this;
    try {
      await deleteObjects(args);
      this.props.dispatch(showInfoBar(`Delete Success`));
      selected = {};
      this.setState({ selected });
    } catch (err) {
      this.props.dispatch(showInfoBar(err.message, "error"));
    }
  };

  getData() {
    let {
      props: { object, applications, objects, rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree, selectedId, filterDefault, currentTab },
      state: {
        sortByName,
        searchText,
        filterActive,
        filterEnable,
        filterFavorite,
        filterError,
      },
    } = this;

    let data;
    if (object == "application") {
      if (currentTab == "RDS") {
        data = rdss.data;
      } else {
        data = vncs.data;
      }
    } else {
      data = getObjectProperty(this.props.data, `${object}s.data`);
    }
    if (data !== null && data !== undefined) {
      data = data.filter((item) => {
        if (!stringValid(searchText)) return true;
        return item.Name.toLowerCase().includes(searchText.toLowerCase());
      });
      if (filterActive !== null) {
        data = data.filter((item) => {
          let { Status } = item;
          let isOff = Status == "" || Status.indexOf("F") >= 0;
          let isActive = Status.indexOf("A")>=0 || Status.indexOf("L") >= 0;
          return filterActive ? isActive : isOff;
        });
      }
      if (filterEnable !== null)
        data = data.filter((item) => (item.Disabled === true) ^ filterEnable);
      if (filterError) data = data.filter((item) => item.Error !== "");
      if (filterFavorite) data = data.filter((item) => item.Favorite);
      if (filterDefault) data = data.filter((item) => item.Default);
      if (selectedId !== undefined && !filterDefault)
        data = data.filter((item) => item.ParentId === selectedId);
      if (data !== "null" && data !== undefined)
        data = data.sort((t1, t2) =>
          sortByName
            ? t1.Name.localeCompare(t2.Name)
            : t2.ModifiedTS - t1.ModifiedTS
        );
    }
    return data;
  }

  popActionsCard() {
    let {
      props: { object },
      state: { selected },
    } = this;
    return (
      <div className="pop-actions-card">
        <div className="text-content">
          <div className="text-b-lg">
            {
              Object.values(selected).filter((isSelect) => isSelect === true)
                .length
            }
          </div>
          <div> SELECTED</div>
        </div>
        <div
          className="list-action-delete"
          onClick={() => this.multiDelete(selected, object)}
        ></div>
      </div>
    );
  }

  render() {
    let state = getObjectProperty(
      this.props.data,
      `${this.props.object}s.state`
    );
    let {
      props: {
        data, dispatch, editingId,
        terminals, servers, applications,
        objects, objectGroups, mainTree,
        rdss, rdsGroups, rdsMainTree,
        vncs, vncGroups, vncMainTree,
        inEditor = true, hasItems = true, showRightClick = false, isGroup = false, isRestart = false, hideFavorite = false, hideNew = false, hideGroup = false, searchContainerWrapper, groupContainerWrapper, original, object, selectedId, insideEditor, filterDefault, wizardOpened, editorOpened,
        currentTab,
      },
      state: {
        showExpand,
        selected,
        sortByName,
        searchText,
        filterActive,
        filterEnable,
        filterFavorite,
        filterError,
      },
    } = this;

	let dataOrg = data;
    data = this.getData();
    let all =
      !stringValid(searchText) &&
      filterActive === null &&
      filterEnable === null &&
      !filterError &&
      !filterFavorite &&
      !filterDefault;
    let totalCount;
    let activeCount;
    let offCount;
    let disabledCount;
    let lockedCount;

    if (data != null) {
      totalCount = data.filter(
        (node) => node.ParentId === selectedId || selectedId === undefined
      ).length;
      activeCount = data.filter(
        (node) =>
          node.Status.indexOf("A")>=0 &&
          (node.ParentId === selectedId || selectedId === undefined)
      ).length;
      offCount = data.filter(
        (node) =>
          (node.Status == "" || node.Status.indexOf("F")>=0) &&
          (node.ParentId === selectedId || selectedId === undefined)
      ).length;
      disabledCount = data.filter(
        (node) =>
          node.Disabled === true &&
          (node.ParentId === selectedId || selectedId === undefined)
      ).length;
      // lockedCount = data.filter(
      //   (node) =>
      //     node.ConfigLock === false &&
      //     (node.ParentId === selectedId || selectedId === undefined)
      // ).length;
    }

    return (
      <section className="main-list-content">
        <article className="filter-content">
          <h3>
            FILTER
            <div className="arrow-right"> </div>
          </h3>
          <section className="fliter-bar">
            <div>
              <div
                onClick={() =>
                  this.changeFilter(
                    filterFavorite,
                    !filterFavorite,
                    "filterFavorite"
                  )
                }
                className={
                  filterFavorite ? "filter-btn bar-click" : "filter-btn"
                }
              >
                FAVORITE
              </div>
            </div>
            {object == TerminalObject && (
              <Fragment>
                <div className="add-side"></div>
                <div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterActive,
                        filterActive === true ? null : true,
                        "filterActive"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterActive === true ? "bar-click" : null
                    )}
                  >
                    <div className="filter-terminal-active"></div>
                    ACTIVE
                  </div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterActive,
                        filterActive === false ? null : false,
                        "filterActive"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterActive === false ? "bar-click" : null
                    )}
                  >
                    <div className="filter-terminal-off"></div>
                    OFF
                  </div>
                </div>
                <div className="add-side"></div>
                <div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterEnable,
                        filterEnable === true ? null : true,
                        "filterEnable"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterEnable === true ? "bar-click" : null
                    )}
                  >
                    ENABLE
                  </div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterEnable,
                        filterEnable === false ? null : false,
                        "filterEnable"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterEnable === false ? "bar-click" : null
                    )}
                  >
                    <div className="filter-disabled"></div>
                    DISABLE
                  </div>
                </div>
              </Fragment>
            )}
            {object == ServerObject && (
              <Fragment>
                <div className="add-side"></div>
                <div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterEnable,
                        filterEnable === true ? null : true,
                        "filterEnable"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterEnable === true ? "bar-click" : null
                    )}
                  >
                    ENABLE
                  </div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterEnable,
                        filterEnable === false ? null : false,
                        "filterEnable"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterEnable === false ? "bar-click" : null
                    )}
                  >
                    <div className="filter-disabled"></div>
                    DISABLE
                  </div>
                </div>
              </Fragment>
            )}
            {object == ApplicationObject && (
              <Fragment>
                <div className="add-side"></div>
                <div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterEnable,
                        filterEnable === true ? null : true,
                        "filterEnable"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterEnable === true ? "bar-click" : null
                    )}
                  >
                    ENABLE
                  </div>
                  <div
                    onClick={() =>
                      this.changeFilter(
                        filterEnable,
                        filterEnable === false ? null : false,
                        "filterEnable"
                      )
                    }
                    className={classNames(
                      "filter-btn",
                      filterEnable === false ? "bar-click" : null
                    )}
                  >
                    <div className="filter-disabled"></div>
                    DISABLE
                  </div>
                </div>
              </Fragment>
            )}
            <div className="add-side"></div>
            <div>
              <div
                onClick={() =>
                  this.changeFilter(filterError, !filterError, "filterError")
                }
                className={filterError ? "filter-btn bar-click" : "filter-btn"}
              >
                <div className="filter-error"></div>
                ERROR
              </div>
            </div>
          </section>
        </article>
        <div className="main-page-second-bar">
          <div
            className="tree-toggle-all ml-20"
            style={{ marginTop: "18px", marginBottom: "10px" }}
            onClick={this.toggleShow}
          >
            {showExpand ? (
              <div className="arrow-down"> </div>
            ) : (
              <div className="arrow-up"> </div>
            )}
            <p>{showExpand ? "EXPAND" : "COLLAPSE"}</p>
          </div>
          <div className="main-search">
            <Search
              id={`${object}_search`}
              inputClass="searchbar wp-100"
              placeholder={
                "Search " +
                `${object !== ApplicationObject ?
                  object.charAt(0).toUpperCase() + object.slice(1) : currentTab
                }`
              }
              value={searchText}
              setSearchText={this.setSearchText}
            />
            <div className="inline-block">
              <span className="mr-8">
                <select
                  style={{ width: "100px" }}
                  onChange={this.onChangeSortType}
                  value={sortByName ? SortType[1] : SortType[2]}
                >
                  {SortType.map((option) => {
                    if (option === "Sort by") {
                      return (
                        <option
                          key={option}
                          disabled
                          style={{ backgroundColor: "#C9C9C9" }}
                        >
                          {option}
                        </option>
                      );
                    } else {
                      return <option key={option}>{option}</option>;
                    }
                  })}
                </select>
              </span>
            </div>
          </div>
          <div className="main-list-total">
            TOTAL<p>{totalCount}</p>
            {this.props.object === "terminal" && (
              <Fragment>
                <div className="terminal-off-sm"></div>
                <p>{offCount}</p>
                <div className="terminal-active-sm"></div>
                <p>{activeCount}</p>
                {/* <div className="terminal-disabled-sm"></div>
                <p>{disabledCount}</p> */}
              </Fragment>
            )}
          </div>
        </div>
        <ObjectTitles
          dispatch={dispatch}
          inEditor={inEditor}
          showRightClick={showRightClick}
          showExpand={showExpand}
          state={state}
          data={data}
          terminals={terminals}
          servers={servers}
          applications={applications}
          objects={objects}
          objectGroups={objectGroups}
          mainTree={mainTree}
          rdss={rdss}
          rdsGroups={rdsGroups}
          rdsMainTree={rdsMainTree}
          vncs={vncs}
          vncGroups={vncGroups}
          vncMainTree={vncMainTree}
          original={original}
          isGroup={isGroup}
          hasItems={hasItems}
          object={object}
          selected={selected}
          click={this.click}
          select={this.select}
          isRestart={isRestart}
          wizardOpened={wizardOpened}
          editorOpened={editorOpened}
          editingId={editingId}
          currentTab={currentTab}
        />
        {Object.values(selected).includes(true) && this.popActionsCard()}
      </section>
    );
  }
}
