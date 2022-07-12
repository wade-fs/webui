import React from "react";

export default class Search extends React.Component {
  onChange = (e) => {
    this.props.setSearchText(e.target.value);
  };

  render() {
    let {
      props: { id, inputClass, placeholder, value },
    } = this;

    return (
      <div className="search-bar mr-16">
        <div className="search-icon"></div>
        <input
          id={id}
          value={value}
          type="text"
          placeholder={placeholder}
          className={inputClass}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
