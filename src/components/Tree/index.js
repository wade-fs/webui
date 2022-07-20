import React from "react";
import { ExpandAndCollapse } from "components/Form/Button";
import { Tab } from "../Form/Button";
import TreeItem from "./TreeItem";
import MultiTreeItem from "./MultiTreeItem";

export function Tree({
  showAllTree,
  toggleAllTree,
  tree,
  outerClass = "",
  expandClass = "",
  selectTab,
  currentTab,
  ...others
}) {
  let treeData
  let filterChildren
  if (tree !== null && tree !== undefined) {
    treeData = tree
  }

  if (currentTab === 'RDS' || currentTab === 'VNC') {
    treeData = tree.filter((item) => item.GroupType === currentTab || item.Id === 0);
    treeData.map((item) => {
      if (item.Children.length > 0) {
        filterChildren = item.Children.filter((item) => item.GroupType === currentTab || item.Id === 0);
        treeData[0].filterChildren = filterChildren
      }
    })
  }
  return (
    <article className="tree">
      <ExpandAndCollapse
        outerClass={expandClass}
        showAllTree={showAllTree}
        toggleAllTree={toggleAllTree}
      />
      {others.treeType === 'appTree' && <Tab tabWidth={160} tabZIndex={6} tabClass="sub-tab-form-button" selectTab={selectTab} currentTab={currentTab} subTabs={["RDS", "VNC"]} />}
      <section className={"tree-content" + outerClass}>
        {tree == null && <p>No data found...</p>}
        {tree != null && typeof tree === "string" && (
          <p className="mt-8">{tree}</p>
        )}
        {tree != null &&
          Array.isArray(tree) === true &&
          treeData.map((item) => (
            <TreeItem
              {...others}
              key={`0_${item.Name}_${item.IsGroup ? 1 : 0}`}
              data={item}
              children={currentTab === 'RDS' || currentTab === 'VNC' ? item.filterChildren : item.Children}
              level={0}
              showAllTree={showAllTree}
              currentTab={currentTab}
            />
          ))}
      </section>
    </article>
  );
}

export function MultiTree({
  showAllTree,
  toggleAllTree,
  tree,
  outerClass = "",
  expandClass = "",
  ...others
}) {
  return (
    <article className="tree">
      <ExpandAndCollapse
        outerClass={expandClass}
        showAllTree={showAllTree}
        toggleAllTree={toggleAllTree}
      />
      <section className={"tree-content" + outerClass}>
        {tree == null && <p>No data found...</p>}
        {tree != null && typeof tree === "string" && (
          <p className="mt-8">{tree}</p>
        )}
        {tree != null &&
          Array.isArray(tree) === true &&
          tree.map((item) => (
            <MultiTreeItem
              {...others}
              key={`0_${item.Name}_${item.IsGroup ? 1 : 0}`}
              data={item}
              children={item.Children}
              level={0}
              showAllTree={showAllTree}
            />
          ))}
      </section>
    </article>
  );
}
