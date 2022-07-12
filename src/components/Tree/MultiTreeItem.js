import React, { Component, Fragment } from "react";
export default class MultiTreeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.showAllTree ? true : false,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.showAllTree !== this.props.showAllTree) {
      this.checkShow();
    }
  }

  toggleView = (treeItem) => {
    let {
      props: { isEditMode, treeType, usedMapFromId },
    } = this;
    if (isEditMode) {
      const isUsed = Object.keys(usedMapFromId).includes(
        treeItem.Id.toString()
      );
      if (!isUsed) {
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
          case "application":
            if (!treeItem.IsGroup) {
              this.selectTreeItem(treeItem);
            }
            break;
          default:
            break;
        }
      }
    }
    if (treeItem.IsGroup) {
      this.setState({
        show: !this.state.show,
      });
    }
  };

  selectTreeItem = (treeItem) => {
    let {
      props: { onSelect },
    } = this;
    onSelect(treeItem);
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

  render() {
    let {
      props: {
        margin = 46,
        hoverwidth = 270,
        onOpenSubEditor = null,
        isEditMode,
        onSelect,
        editingId,
        showAllTree,
        treeType,
        data,
        selectedMapFromId,
        usedMapFromId,
        children,
        level,
      },
      state: { show },
    } = this;
    let filter = true;
    switch (treeType) {
      case "terminalReplace":
        if (
          data.IsGroup ||
          ((data.Status.indexOf("F") >= 0 || data.Status === "") && data.Replaceable)
        ) {
          filter = false;
        }
        break;
      case "appServer":
        filter = false;
        break;
      case "terminalGroup":
      case "appServerGroup":
        if (
          data.Id !== 0 &&
          data.IsGroup &&
          (editingId === 0 || (editingId !== 0 && editingId !== data.Id))
        ) {
          filter = false;
        }
        break;
      case "application":
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
          <div
            className="tree-item"
            style={{
              cursor: isEditMode ? "pointer" : "default",
            }}
            onClick={() => this.toggleView(data)}
          >
            <span className="tree-sign">
              <div
                className={"flex" + (level !== 0 ? " tree-line" : "")}
                style={{
                  width: String(hoverwidth + level * 32 + "px"),
                }}
              >
                {spaces}
                {data.IsGroup ? (
                  <div
                    className={show ? "collapse-item" : "expand-item"}
                    style={{ cursor: isEditMode ? "pointer" : "default" }}
                  ></div>
                ) : (
                  <div className="tree-space"></div>
                )}
                <div
                  className={
                    data.IsGroup === false && selectedMapFromId[data.Id] != null
                      ? "tree-list selected"
                      : data.IsGroup === false && usedMapFromId[data.Id] != null
                      ? "tree-list moved"
                      : "tree-list"
                  }
                  style={{
                    width: `${hoverwidth}px`,
                    cursor: isEditMode ? "pointer" : "default",
                  }}
                >
                  {data.IsGroup ? (
                    <div
                      className={
                        data.Favorite ? "favrite-folder-item" : "folder-item"
                      }
                    ></div>
                  ) : treeType === "appServer" ? (
                    <div className="item-rds-server"></div>
                  ) : treeType === "application" ? (
                    <div className="item-app"></div>
                  ) : (
                    <div className="item-terminal"></div>
                  )}
                  <p className="inline-block ml-8">{data.Name}</p>
                  {!isEditMode && data.IsGroup === false && (
                    <div
                      className="action-setting"
                      onClick={() => onOpenSubEditor(data.Id, false)}
                    ></div>
                  )}
                </div>
              </div>
            </span>
          </div>
          {show &&
            Array.isArray(children) &&
            children.length > 0 &&
            children.map((node) => {
              return (
                node && (
                  <MultiTreeItem
                    key={`${level}_${node.Name}_${node.IsGroup ? 1 : 0}`}
                    margin={margin}
                    hoverwidth={hoverwidth}
                    isEditMode={isEditMode}
                    editingId={editingId}
                    showAllTree={showAllTree}
                    treeType={treeType}
                    data={node}
                    selectedMapFromId={selectedMapFromId}
                    usedMapFromId={usedMapFromId}
                    children={node.Children}
                    level={level + 1}
                    onSelect={onSelect}
                    onOpenSubEditor={onOpenSubEditor}
                  />
                )
              );
            })}
        </Fragment>
      )
    );
  }
}
