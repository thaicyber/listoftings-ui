import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoSuggest from 'react-autosuggest';

// When suggestion is clicked, AutoSuggest needs to populate the input element
// based on the clicked suggestion. Tell AutoSuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

const addTagForHighlight = (str, start, delCount, newSubStr) =>
  str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));

export default class AutoSuggestContainer extends Component {
  state = {
    autosuggestValue: '',
    suggestions: [],
  };

  componentDidMount() {
    // document.querySelector('.react-autosuggest__container').addEventListener('click', e => e.target.scrollIntoView({ behavior: 'smooth' }));
  }

  onChange = (event, { newValue }) => {
    const { changeReporter } = this.props;
    this.setState({ autosuggestValue: newValue });
    changeReporter(newValue);
  };

  // AutoSuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: this.getSuggestions(value) });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    const { selectionChangedReporter } = this.props;
    if (selectionChangedReporter) selectionChangedReporter(suggestion);
  };

  // AutoSuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  // Teach AutoSuggest how to calculate suggestions for any given input value.
  getSuggestions(value) {
    const { categories } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : categories.filter(lang =>
      lang.name.toLowerCase().split(' ').some(v => v.slice(0, inputLength) === inputValue),
    );
  }

  // Render suggestions.
  renderSuggestion = (suggestion, query) => {
    const search = query.query.toLowerCase();
    const start = suggestion.name.toLowerCase().indexOf(search);
    const end = start + search.length;
    // const match = suggestion.name.substr(start, end);
    let str = addTagForHighlight(suggestion.name, start, 0, '<b>');
    str = addTagForHighlight(str, (end + 3), 0, '</b>');

    return (<div dangerouslySetInnerHTML={{ __html: str }} />);
  }

  render() {
    const { autosuggestValue, suggestions } = this.state;

    // AutoSuggest will pass through all these props to the input element.
    const autosuggestInputProps = {
      placeholder: 'Search speciality',
      value: autosuggestValue,
      onChange: this.onChange,
    };

    return (
      <AutoSuggest
        suggestions={suggestions}
        onSuggestionSelected={this.onSuggestionSelected}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={autosuggestInputProps}
      />
    );
  }
}

AutoSuggestContainer.propTypes = {
  changeReporter: PropTypes.func.isRequired,
  selectionChangedReporter: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
