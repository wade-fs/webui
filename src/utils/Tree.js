export const TREE_NO_GROUP = {
  Id: 0,
  Name: "NoGroup",
  ParentId: 0,
  IsGroup: true,
  Children: [],
};

export async function convertListToTree(objectList, groupList) {
  try {
    if (
      Array.isArray(objectList) === false ||
      Array.isArray(groupList) === false
    ) {
      throw TypeError("List type must be Array");
    }
    checkFormat(groupList, true);
    checkFormat(objectList, false);

    // mapping data
    let mapping = tempMapping(objectList, groupList);
    const isNotMatch = Object.values(mapping).some((item) => {
      return mapping[item.ParentId] == null;
    });
    if (isNotMatch) throw Error("Group is not exist");
    const rootNodes = Object.values(mapping).filter(
      (item) => item.ParentId === 0
    );
    return rootNodes.reduce((acc, cur) => {
      const children = cur.Id !== 0 ? findChildren(cur, [], mapping) : [];
      cur.Children = cur.Children.concat(children);
      acc.push(cur);
      return acc;
    }, []);
  } catch (e) {
    if (e) {
      return e.message;
    }
    return "Parent and object id not match";
  }
}

function tempMapping(objectList, groupList) {
  const sortObjectList = sortList(objectList);
  return sortObjectList.reduce((acc, cur) => {
    if (acc[cur.ParentId] == null) {
      throw Error("Group is not exist");
    }
    acc[cur.ParentId].Children.push({
      Id: cur.Id,
      Name: cur.Name,
      ParentId: cur.ParentId,
      IsGroup: false,
      ModifiedTS: cur.ModifiedTS,
    });
    return acc;
  }, mappingGroup(groupList));
}

function mappingGroup(groupList) {
  const sortGroupList = sortList(groupList);
  return sortGroupList.reduce(
    (accGroup, curGroup) => {
      accGroup[curGroup.Id] = {
        Id: curGroup.Id,
        Name: curGroup.Name,
        ParentId: curGroup.ParentId,
        IsGroup: true,
        ModifiedTS: curGroup.ModifiedTS,
        Children: [],
      };
      return accGroup;
    },
    { 0: JSON.parse(JSON.stringify(TREE_NO_GROUP)) }
  );
}

function findChildren(node, children, mapping, index = 0) {
  children = Object.values(mapping).filter((item) => item.ParentId === node.Id);
  for (const child of children) {
    if (child.IsGroup === true) {
      let descendant = Object.values(mapping).filter(
        (item) => item.ParentId === child.Id
      );
      if (descendant.length > 0) {
        const subChildren = findChildren(child, descendant, mapping, index);
        children[index].Children = children[index].Children.concat(subChildren);
      }
    }
    index++;
  }
  return children;
}

function sortList(list) {
  return list.sort((a, b) => (a.Name > b.Name ? 1 : -1));
}

function checkFormat(list, isGroup) {
  if (Array.isArray(list) === true && list.length > 0) {
    if (
      list.some((item) => {
        return (
          item.Id == null ||
          item.Name == null ||
          item.ParentId == null ||
          item.Favorite == null ||
          item.ModifiedTS == null
        );
      })
    ) {
      if (isGroup) throw TypeError("Group format is wrong");
      throw TypeError("Object format is wrong");
    }
  }
}
