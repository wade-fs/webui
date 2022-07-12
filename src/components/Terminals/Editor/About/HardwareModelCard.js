import React, { Fragment } from "react";
import { Title } from "components/Card";

import { Id, Model, Name } from "const/Terminals/TerminalFieldNames";

export default class HardwareModelCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: {},
      modelInfo: [],
    };
  }

  componentDidMount() {
    let { terminals, editingId } = this.props;
    this.generateModelMap(terminals.data, editingId);
  }

  generateModelMap(terminals, editingId) {
    if (terminals == null) return;
    let map = new Map();
    let descendants = terminals.filter((item) => item.ParentId === editingId);
    if (descendants.length == 0) return;
    for (let node of descendants) {
      const terminal = this.findTerminal(node.Id, terminals);
      const model = terminal[Model];
      if (!map.has(model)) {
        map.set(model, { model: model, count: 0, terminals: [] });
      }
      let item = map.get(model);
      item.count++;
      item.terminals.push(node[Name]);
      map.set(model, item);
    }
    this.setState({
      selectedModel: [...map.values()][0],
      modelInfo: [...map.values()],
    });
  }
  findTerminal = (id, terminals) => {
    return terminals.find((t) => t[Id] == id);
  };
  onSelect = (selectedModel) => {
    this.setState({ selectedModel });
  };

  render() {
    let {
      state: { selectedModel, modelInfo },
    } = this;

    return (
      <div
        className="wrap-960 wrap-bg-w no-radius mb-0"
        style={{ height: "320px", overflow: "auto" }}
      >
        <Title title="TERMINAL HARDWARE MODELS IN THIS GROUP" />
        <div className="select-model">
          <div className="model-title clearfix">
            <p className="title title-left">MODEL (A~Z)</p>
            <p className="title title-center">VALUE</p>
            <p className="title title-right">
              MEMBERS (SELECT A MODEL TO VIEW)
            </p>
          </div>
          <ul className="select-content float_left">
            {modelInfo.map((item) => (
              <li
                key={item.model}
                className={
                  selectedModel.model == item.model
                    ? "model-content click"
                    : "model-content"
                }
                onClick={() => this.onSelect(item)}
              >
                <p className="left">{item.model}</p>{" "}
                <p className="right">{item.count}</p>
              </li>
            ))}
          </ul>
          <ul className="select-content2 float_left">
            {selectedModel !== undefined &&
              selectedModel.terminals != null &&
              selectedModel.terminals.map((item) => (
                <li key={item} className="bgc-ge9">
                  <p>{item}</p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
