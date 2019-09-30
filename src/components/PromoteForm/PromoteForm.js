import React, { Component } from "react";
import { pieces } from "../../constants";
import "./PromoteForm.css";

const { bishop, knight, queen, pawn, rook } = pieces;

class PromoteForm extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedOption: pawn };
  }
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
    return (
      <form className="PromoteForm" onSubmit={this.handleSubmit}>
        <div>
          <label>{queen}</label>
          <input
            name={queen}
            type="radio"
            onChange={this.handleChange}
            checked={this.state.selectedOption === queen}
          />
        </div>
        <div>
          <label>{knight}</label>
          <input
            name={knight}
            type="radio"
            onChange={this.handleChange}
            checked={this.state.selectedOption === knight}
          />
        </div>
        <div>
          <label>{rook}</label>
          <input
            name={rook}
            type="radio"
            onChange={this.handleChange}
            checked={this.state.selectedOption === rook}
          />
        </div>
        <div>
          <label>{bishop}</label>
          <input
            name={bishop}
            type="radio"
            onChange={this.handleChange}
            checked={this.state.selectedOption === bishop}
          />
        </div>
        <input type="submit" />
      </form>
    );
  }
}

export default PromoteForm;
