import React from "react";

export function TogglePassword({ showPassword, onClick }) {
  return (
    <div className="toggle-password-btn" onClick={onClick}>
      {showPassword ? (
        <i className="fas fa-eye-slash" style={{ color: "gray" }}></i>
      ) : (
        <i className="fas fa-eye" style={{ color: "gray" }}></i>
      )}
    </div>
  );
}

export function ExpandAndCollapse({
  showAllTree,
  outerClass = "",
  toggleAllTree,
}) {
  return (
    <div className={"tree-toggle-all" + outerClass} onClick={toggleAllTree}>
      {showAllTree ? (
        <div className="arrow-down"> </div>
      ) : (
        <div className="arrow-up"> </div>
      )}
      <p>{showAllTree ? "EXPAND" : "COLLAPSE"}</p>
    </div>
  );
}

export function CancelAndConfirm({
  type = "CONFIRM",
  canConfirm = true,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="nav-footer">
      <a className="cancel-btn" href="#" onClick={onCancel}>
        CANCEL
      </a>
      <a
        href="#"
        className={
          type === "CONFIRM" || type === "APPLY" ? "primary-btn" : "alert-btn"
        }
        disabled={!canConfirm}
        onClick={canConfirm === true ? onConfirm : null}
      >
        {type}
      </a>
    </div>
  );
}

export function Tab({
  tabWidth,
  tabZIndex,
  tabClass,
  subTabs,
  currentTab,
  selectTab,
}) {
  return (
    <nav className="modal-sub-tab-form-button">
      <ul>
        {subTabs.map((tab, index) => (
          <li
          key={tab}
          className={tabClass + (tab === currentTab ? " sub-tab-click" : "")}
            name={tab}
            style={
              tab === currentTab
              ? { left: String(tabWidth * index + 20 + "px"), zIndex: 10 }
                : {
                    left: String(tabWidth * index + 20 + "px"),
                    zIndex: tabZIndex - index,
                  }
            }
            onClick={(e) => selectTab(e.target.getAttribute("name"))}
            >
            {tab}
          </li>
        ))}
      </ul>
    </nav>
  );
}
