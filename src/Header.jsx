import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format as formatDate, isValid, parse, getHours, getMinutes, getSeconds } from 'date-fns';
import classNames from 'classnames';

const checkFormat = str => /^\d{2}:\d{2}(:\d{2})?$/.test(str);

class Header extends Component {
  static propTypes = {
    format: PropTypes.string,
    prefixCls: PropTypes.string,
    disabledDate: PropTypes.func,
    placeholder: PropTypes.string,
    clearText: PropTypes.string,
    value: PropTypes.object,
    inputReadOnly: PropTypes.bool,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onChange: PropTypes.func,
    onEsc: PropTypes.func,
    defaultOpenValue: PropTypes.object,
    currentSelectPanel: PropTypes.string,
    focusOnOpen: PropTypes.bool,
    onKeyDown: PropTypes.func,
    clearIcon: PropTypes.node,
  };

  static defaultProps = {
    inputReadOnly: false,
  };

  constructor(props) {
    super(props);
    const { value, format } = props;
    this.state = {
      str: (value && formatDate(value, format)) || '',
      invalid: false,
    };
  }

  componentDidMount() {
    const { focusOnOpen } = this.props;
    if (focusOnOpen) {
      // Wait one frame for the panel to be positioned before focusing
      const requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
      requestAnimationFrame(() => {
        this.refInput.focus();
        this.refInput.select();
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, format } = nextProps;
    this.setState({
      str: (value && formatDate(value, format)) || '',
      invalid: false,
    });
  }

  onInputChange = event => {
    const str = event.target.value;
    this.setState({
      str,
    });
    const { format, disabledHours, disabledMinutes, disabledSeconds, onChange } = this.props;

    if (str) {
      const parsed = parse(str, format, new Date(1990, 0, 0));
      if (!isValid(parsed) || !checkFormat(str)) {
        this.setState({
          invalid: true,
        });
        return;
      }

      // if time value is disabled, response warning.
      const disabledHourOptions = disabledHours();
      const disabledMinuteOptions = disabledMinutes(getHours(parsed));
      const disabledSecondOptions = disabledSeconds(getHours(parsed), getMinutes(parsed));
      if (
        (disabledHourOptions && disabledHourOptions.indexOf(getHours(parsed)) >= 0) ||
        (disabledMinuteOptions && disabledMinuteOptions.indexOf(getMinutes(parsed)) >= 0) ||
        (disabledSecondOptions && disabledSecondOptions.indexOf(getSeconds(parsed)) >= 0)
      ) {
        this.setState({
          invalid: true,
        });
        return;
      }

      onChange(parsed);
    } else {
      onChange(null);
    }

    this.setState({
      invalid: false,
    });
  };

  onKeyDown = e => {
    const { onEsc, onKeyDown } = this.props;
    if (e.keyCode === 27) {
      onEsc();
    }

    onKeyDown(e);
  };

  getProtoValue() {
    const { value, defaultOpenValue } = this.props;
    return value || defaultOpenValue;
  }

  getInput() {
    const { prefixCls, placeholder, inputReadOnly } = this.props;
    const { invalid, str } = this.state;
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <input
        className={classNames(`${prefixCls}-input`, invalidClass)}
        ref={ref => {
          this.refInput = ref;
        }}
        onKeyDown={this.onKeyDown}
        value={str}
        placeholder={placeholder}
        onChange={this.onInputChange}
        readOnly={!!inputReadOnly}
      />
    );
  }

  render() {
    const { prefixCls } = this.props;
    return <div className={`${prefixCls}-input-wrap`}>{this.getInput()}</div>;
  }
}

export default Header;
