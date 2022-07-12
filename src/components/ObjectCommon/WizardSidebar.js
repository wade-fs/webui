import React from "react";

export class Tab {
  constructor(label, options) {
    this.label = label;
    if (options != null) {
      let { clickable, visited, completed } = options;
      this.clickable = clickable == true;
      this.completed = completed == true;
      this.visited = visited == true;
    }
  }
}

export default class WizardSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  selectTab = (index) => {
    let {
      props: { tabs, onSelect },
    } = this;
    if (tabs[index].clickable && !!onSelect) {
      onSelect(index);
    }
  };
  getClass(index) {
    let {
      props: { selectedTabIndex },
    } = this;
    let className = "active";
    if (index == 0) className = `${className} mt-45`;
    if (selectedTabIndex == index) return className;
    return `${className} op-35`;
  }

  render() {
    let {
      props: { selectedTabIndex, tabs },
    } = this;
    return (
      <div className="wizard-sidebar">
        {tabs.map((tab, index) => (
          <div
            key={`sidebar_${tab.label}`}
            className={this.getClass(index)}
            onClick={() => this.selectTab(index)}
            style={tab.clickable ? { cursor: "pointer" } : { cursor: "auto" }}
          >
            {tab.visited && <div className="circle"></div>}
            {selectedTabIndex == index && <div className="circle this"></div>}
            <p>{tab.label}</p>
          </div>
        ))}
      </div>
    );
  }
}
