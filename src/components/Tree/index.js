import React from "react";
import { ExpandAndCollapse } from "components/Form/Button";
import { TreeTab } from "../Form/Button";
import TreeItem from "./TreeItem";
import MultiTreeItem from "./MultiTreeItem";

export function Tree({
  showAllTree,
  toggleAllTree,
  tree,
  outerClass = "",
  expandClass = "",
  rdss,
  rdsGroups,
  rdsMainTree,
  vncs,
  vncGroups,
  vncMainTree,
  selectTab,
  currentTab,
  ...others
}) {

  return (
    <article className="tree">
      <ExpandAndCollapse
        outerClass={expandClass}
        showAllTree={showAllTree}
        toggleAllTree={toggleAllTree}
      />
      {others.treeType === 'appTree' && <TreeTab tabWidth={160} tabZIndex={6} tabClass="sub-tab-form-button" selectTab={selectTab} currentTab={currentTab} subTabs={["RDS", "VNC"]} />}
      <section className={"tree-content" + outerClass}>
        {tree == null && <p>No data found...</p>}
        {tree != null && typeof tree === "string" && (
          <p className="mt-8">{tree}</p>
        )}
        {tree != null &&
          Array.isArray(tree) === true &&
          tree.map((item) => (
            <TreeItem
              {...others}
              key={`0_${item.Name}_${item.IsGroup ? 1 : 0}`}
              data={item}
              children={item.Children}
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
  rdss,
  rdsGroups,
  rdsMainTree,
  vncs,
  vncGroups,
  vncMainTree,
  outerClass = "",
  expandClass = "",
  selectTab,
  currentTab,
  ...others
}) {

  return (
    <article className="tree">
      <ExpandAndCollapse
        outerClass={expandClass}
        showAllTree={showAllTree}
        toggleAllTree={toggleAllTree}
      />
      {(others.treeType === 'application' || others.treeType === 'appTree') &&
       <TreeTab tabWidth={160}
                tabZIndex={6}
                tabClass="sub-tab-form-button"
                selectTab={selectTab}
                currentTab={currentTab}
                subTabs={["RDS", "VNC"]} />}
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
