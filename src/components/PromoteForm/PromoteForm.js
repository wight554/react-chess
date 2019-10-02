import React, { Component } from "react";
import { pieces } from "../../constants";
import "./PromoteForm.css";

const { bishop, knight, queen, rook } = pieces;

class PromoteForm extends Component {
  state = { selectedOption: bishop };
  handleChange = event => {
    this.setState({
      selectedOption: event.target.name
    });
  };
  handleSubmit = event => {
    this.props.handlePromotePawn(this.state.selectedOption);
    event.preventDefault();
  };
  render() {
    const radioButtons = [bishop, knight, queen, rook].map(p => (
      <label key={p}>
        {p}
        <input
          name={p}
          type="radio"
          onChange={this.handleChange}
          checked={this.state.selectedOption === p}
        />
      </label>
    ));
    return (
      <form className="PromoteForm" onSubmit={this.handleSubmit}>
        {radioButtons}
        <input type="submit" />
      </form>
    );
  }
}

export default PromoteForm;
