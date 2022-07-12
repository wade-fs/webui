import { convertListToTree, TREE_NO_GROUP } from "../utils/Tree";

describe("convertListToTree", () => {
  const treeConditions = [
    {
      caseName: "both input null Array",
      items: [],
      groups: [],
      result: [TREE_NO_GROUP],
    },
    {
      caseName: "both input are not Array",
      items: "",
      groups: 1,
      result: "List type must be Array",
    },
    {
      caseName: "both wrong input format",
      items: [1, 3],
      groups: [{ hi: 0 }, { no: [] }],
      result: "Group format is wrong",
    },
    {
      caseName: "input wrong object format",
      items: [1, 3],
      groups: [
        {
          Id: 2,
          Name: "terminal_group_2",
          ParentId: 0,
          Favorite: false,
          ModifiedTS: 1621247822998,
        },
      ],
      result: "Object format is wrong",
    },
    {
      caseName: "input wrong group format",
      items: [
        {
          Id: 3,
          Name: "terminal_3",
          ParentId: 5,
          Favorite: false,
          ModifiedTS: 1621247822999,
          Error: "error description",
          Status: "OFF",
          ScreenOfAppIds: "",
          Replaceable: true,
          Manufacturer: "Arista",
          Model: "BoxPC138G",
          NeedToRestart: false,
          Default: false,
          Disabled: false,
        },
      ],
      groups: [{ hi: 0 }, { no: [] }],
      result: "Group format is wrong",
    },
    {
      caseName: "input not exists parent id of object",
      items: [
        {
          Id: 3,
          Name: "terminal_3",
          ParentId: 5,
          Favorite: false,
          ModifiedTS: 1621247822999,
          Error: "error description",
          Status: "OFF",
          ScreenOfAppIds: "",
          Replaceable: true,
          Manufacturer: "Arista",
          Model: "BoxPC138G",
          NeedToRestart: false,
          Default: false,
          Disabled: false,
        },
      ],
      groups: [
        {
          Id: 2,
          Name: "terminal_group_2",
          ParentId: 0,
          Favorite: false,
          ModifiedTS: 1621247822998,
        },
      ],
      result: "Group is not exist",
    },
    {
      caseName: "input not exists parent id of group",
      items: [
        {
          Id: 3,
          Name: "terminal_3",
          ParentId: 1,
          Favorite: false,
          ModifiedTS: 1621247822999,
          Error: "error description",
          Status: "OFF",
          ScreenOfAppIds: "",
          Replaceable: true,
          Manufacturer: "Arista",
          Model: "BoxPC138G",
          NeedToRestart: false,
          Default: false,
          Disabled: false,
        },
      ],
      groups: [
        {
          Id: 1,
          Name: "terminal_group_1",
          ParentId: 5,
          Favorite: false,
          ModifiedTS: 1621247822700,
        },
      ],
      result: "Group is not exist",
    },
    {
      caseName: "input format correctly",
      items: [
        {
          Id: 3,
          Name: "terminal_3",
          ParentId: 5,
          Favorite: false,
          ModifiedTS: 1621247822999,
          Error: "error description",
          Status: "OFF",
          ScreenOfAppIds: "",
          Replaceable: true,
          Manufacturer: "Arista",
          Model: "BoxPC138G",
          NeedToRestart: false,
          Default: false,
          Disabled: false,
        },
        {
          Id: 6,
          Name: "terminal_3",
          ParentId: 7,
          Favorite: false,
          ModifiedTS: 1621247822999,
          Error: "error description",
          Status: "OFF",
          ScreenOfAppIds: "",
          Replaceable: true,
          Manufacturer: "Arista",
          Model: "BoxPC138G",
          NeedToRestart: false,
          Default: false,
          Disabled: false,
        },
        {
          Id: 4,
          Name: "terminal_3",
          ParentId: 0,
          Favorite: false,
          ModifiedTS: 1621247822999,
          Error: "error description",
          Status: "OFF",
          ScreenOfAppIds: "",
          Replaceable: true,
          Manufacturer: "Arista",
          Model: "BoxPC138G",
          NeedToRestart: false,
          Default: false,
          Disabled: false,
        },
      ],
      groups: [
        {
          Id: 5,
          Name: "terminal_group_2",
          ParentId: 8,
          Favorite: false,
          ModifiedTS: 1621247822999,
        },
        {
          Id: 1,
          Name: "terminal_group_1",
          ParentId: 7,
          Favorite: false,
          ModifiedTS: 1621247822700,
        },
        {
          Id: 7,
          Name: "terminal_group_2",
          ParentId: 0,
          Favorite: false,
          ModifiedTS: 1621247822998,
        },
        {
          Id: 2,
          Name: "terminal_group_2",
          ParentId: 1,
          Favorite: false,
          ModifiedTS: 1621247822998,
        },
        {
          Id: 8,
          Name: "terminal_group_2",
          ParentId: 0,
          Favorite: false,
          ModifiedTS: 1621247822998,
        },
      ],
      result: [
        {
          Id: 0,
          Name: "NoGroup",
          ParentId: 0,
          IsGroup: true,
          Children: [
            {
              Id: 4,
              Name: "terminal_3",
              ParentId: 0,
              IsGroup: false,
              ModifiedTS: 1621247822999,
            },
          ],
        },
        {
          Id: 7,
          Name: "terminal_group_2",
          ParentId: 0,
          IsGroup: true,
          ModifiedTS: 1621247822998,
          Children: [
            {
              Id: 6,
              Name: "terminal_3",
              ParentId: 7,
              IsGroup: false,
              ModifiedTS: 1621247822999,
            },
            {
              Id: 1,
              Name: "terminal_group_1",
              ParentId: 7,
              IsGroup: true,
              ModifiedTS: 1621247822700,
              Children: [
                {
                  Id: 2,
                  Name: "terminal_group_2",
                  ParentId: 1,
                  IsGroup: true,
                  ModifiedTS: 1621247822998,
                  Children: [],
                },
              ],
            },
          ],
        },
        {
          Id: 8,
          Name: "terminal_group_2",
          ParentId: 0,
          IsGroup: true,
          ModifiedTS: 1621247822998,
          Children: [
            {
              Id: 5,
              Name: "terminal_group_2",
              ParentId: 8,
              IsGroup: true,
              ModifiedTS: 1621247822999,
              Children: [
                {
                  Id: 3,
                  Name: "terminal_3",
                  ParentId: 5,
                  IsGroup: false,
                  ModifiedTS: 1621247822999,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  for (const element of treeConditions) {
    it(element.caseName, async () => {
      const tree = await convertListToTree(element.items, element.groups);
      expect(tree).toEqual(element.result);
    });
  }
});
