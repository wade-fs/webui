import React, { Component, Fragment } from "react";
import {
  getTerminalStatus,
  getRdsServerStatus,
  getAppStatus,
} from "utils/Status";

export default class TreeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.showAllTree ? true : false,
      selectedId: props.selectedId,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.showAllTree !== this.props.showAllTree) {
      this.checkShow();
    }
  }

  toggleView = (treeItem) => {
    let {
      props: { treeType },
    } = this;
    switch (treeType) {
      case "terminal":
      case "terminalReplace":
      case "appServer":
        if (!treeItem.IsGroup) {
          this.selectTreeItem(treeItem.Id);
        }
        break;
      case "terminalGroup":
      case "appServerGroup":
        this.selectTreeItem(treeItem.Id);
        break;
      case "appGroup":
        this.selectTreeItem(treeItem);
        break;
      case "application":
        if (!treeItem.IsGroup) {
          this.selectTreeItem(treeItem.Id);
        }
        break;
      case "terminalTree":
      case "appServerTree":
      case "appTree":
        if (treeItem.IsGroup) {
          this.selectTreeItem(treeItem.Id);
        }
        break;
      default:
        break;
    }
    if (treeItem.IsGroup) {
      this.setState({
        show: !this.state.show,
      });
    }
  };

  selectTreeItem = (id) => {
    let {
      props: { onSelect },
    } = this;
    onSelect(id);
  };

  checkShow = () => {
    let {
      props: { showAllTree },
      state: { show },
    } = this;
    if (showAllTree && !show) {
      this.setState({ show: true });
    } else if (!showAllTree && show) {
      this.setState({ show: false });
    }
  };

  getTreeItems = (data) => {
    let {
      props: { treeType, selectedId },
    } = this;
    switch (treeType) {
      case "terminalTree":
      case "appServerTree":
      case "appTree":
      case "terminalGroup":
      case "appServerGroup":
      case "appGroup":
        if (data.IsGroup === true && data.Id === selectedId) {
          return "tree-list selected";
        }
        return "tree-list";
      case "terminal":
      case "terminalReplace":
      case "appServer":
      case "application":
        if (data.IsGroup === false && data.Id === selectedId) {
          return "tree-list selected";
        }
        return "tree-list";

      default:
        return "tree-list";
    }
  };
  treeIcon(data) {
    let {
      props: { treeType },
    } = this;
    if (data.IsGroup === true) {
      return (
        <div
          className={data.Favorite ? "favrite-folder-item" : "folder-item"}
        ></div>
      );
    } else {
      switch (treeType) {
        case "terminal":
        case "terminalReplace":
          return <div className="item-terminal-off"></div>;
        case "appServer":
          return <div className="item-rds-server"></div>;
        case "application":
          return <div className="item-app"></div>;
        case "terminalTree":
          return this.terminalStatus(data);
        case "appServerTree":
          return this.rdsServerStatus(data);
        case "appTree":
          return this.appStatus(data);
        default:
          return;
      }
    }
  }
  terminalStatus(data) {
    let {
      props: { wsItems },
    } = this;
    return Object.keys(wsItems).length !== 0 &&
      wsItems[data.Id] !== undefined ? (
      <div className={getTerminalStatus("item", wsItems[data.Id])}></div>
    ) : (
      <div className="item-terminal-off"></div>
    );
  }
  rdsServerStatus(data) {
    let {
      props: { wsItems },
    } = this;
    return Object.keys(wsItems).length !== 0 &&
      wsItems[data.Id] !== undefined ? (
      <div className={getRdsServerStatus("item", wsItems[data.Id])}></div>
    ) : (
      <div className="item-rds-server"></div>
    );
  }
  appStatus(data) {
    let {
      props: { wsItems },
    } = this;
    return Object.keys(wsItems).length !== 0 &&
      wsItems[data.Id] !== undefined ? (
      <div className={getAppStatus("item", wsItems[data.Id])}></div>
    ) : (
      <div className="item-app"></div>
    );
  }
  settingIcon(data) {
    let {
      props: { loading, treeType, selectedId, openEditor },
    } = this;
    return (
      !loading &&
      data.IsGroup === true &&
      (treeType === "terminalTree" ||
        treeType === "appServerTree" ||
        treeType === "appTree") &&
      data.Id !== 0 &&
      selectedId === data.Id && (
        <div
          className="action-setting"
          onClick={() => openEditor(data.Id, true)}
        ></div>
      )
    );
  }

  render() {
    let {
      props: {
        defaultFilter = true,
        loading = false,
        wsItems = {},
        openEditor = null,
        margin = 36,
        hoverwidth = 400,
        level,
        treeType,
        data,
        editingId,
        children,
        selectedId,
        showAllTree,
        onSelect,
      },
      state: { show },
    } = this;
    let filter = defaultFilter;
    let id = data?.Id ?? 0;
    let status = wsItems[id]?.Status ?? "";
    let replaceable = wsItems[id]?.Replaceable ?? false;
    let isOff = status == "" || status.indexOf("F") >= 0;
    switch (treeType) {
      case "terminal":
        filter = false;
        break;
      case "terminalReplace":
        if (data.IsGroup || (isOff && replaceable)) {
          filter = false;
        }
        break;
      case "appServer":
        filter = false;
        break;
      case "terminalGroup":
      case "appServerGroup":
      case "appGroup":
        if (
          filter === false ||
          (data.IsGroup &&
            (editingId === 0 || (editingId !== 0 && editingId !== data.Id)))
        ) {
          filter = false;
        }
        break;
      case "application":
        filter = false;
        break;
      case "terminalTree":
      case "appServerTree":
      case "appTree":
        filter = false;
        break;
      default:
        break;
    }
    const spaces = [];
    if (level > 1) {
      for (let i = 0; i < level - 1; i++) {
        spaces.push(<div className="tree-space"></div>);
      }
    }

    return (
      !filter && (
        <Fragment>
          <div className="tree-item" onClick={() => this.toggleView(data)}>
            <span className="tree-sign">
              {show ? (
                <div
                  className={"flex" + (level !== 0 ? " tree-line" : "")}
                  style={{
                    width: String(hoverwidth + level * 50 + "px"),
                  }}
                >
                  {spaces}
                  {data.IsGroup && <div className="collapse-item"></div>}
                  <div
                    className={this.getTreeItems(data)}
                    style={{
                      width: `${hoverwidth}px`,
                    }}
                    onClick={
                      (treeType === "terminalTree" ||
                        treeType === "appServerTree" ||
                        treeType === "appTree") &&
                      !data.IsGroup
                        ? () => openEditor(data.Id, false)
                        : null
                    }
                  >
                    {this.treeIcon(data)}
                    <p
                      className="inline-block"
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      {data.Name}
                    </p>
                    {this.settingIcon(data)}
                  </div>
                </div>
              ) : (
                <div
                  className={"flex" + (level !== 0 ? " tree-line" : "")}
                  style={{
                    width: String(hoverwidth + level * 50 + "px"),
                  }}
                >
                  {spaces}
                  {data.IsGroup && <div className="expand-item"></div>}
                  <div
                    className={this.getTreeItems(data)}
                    style={{
                      width: `${hoverwidth}px`,
                    }}
                    onClick={
                      (treeType === "terminalTree" ||
                        treeType === "appServerTree" ||
                        treeType === "appTree") &&
                      !data.IsGroup
                        ? () => openEditor(data.Id, false)
                        : null
                    }
                  >
                    {this.treeIcon(data)}
                    <p
                      className="inline-block"
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      {data.Name}
                    </p>
                    {this.settingIcon(data)}
                  </div>
                </div>
              )}
            </span>
          </div>
          {show &&
            Array.isArray(children) &&
            children.length > 0 &&
            children.map((node) => {
              return (
                node && (
                  <TreeItem
                    key={`${level + 1}_${node.Name}_${node.IsGroup ? 1 : 0}`}
                    loading={loading}
                    wsItems={wsItems}
                    margin={margin}
                    hoverwidth={hoverwidth}
                    editingId={editingId}
                    showAllTree={showAllTree}
                    treeType={treeType}
                    data={node}
                    children={node.Children}
                    level={level + 1}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    openEditor={openEditor}
                  />
                )
              );
            })}
        </Fragment>
      )
    );
  }
}
