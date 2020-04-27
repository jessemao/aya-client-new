import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

import React, { Component } from 'react';
import { Row, Col } from 'antd';
import './index.css';
import { isObject } from '../../../utils';

class GroupComponent extends Component {
  static defaultProps = {
    mode: 'multiple',
  }

  constructor(props) {
    super(props);
    this.state = {
      value: this.convertValueByMode(props),
    };
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;
    if (!value || !value[0]) {
      const nextValue = this.convertValueByMode(nextProps);
      this.setState({
        value: nextValue,
      });
    }
  }

  convertValueByMode(props) {
    const { mode, value } = props;
    if (mode === 'map' && value && isObject(value)) {
      if (!Object.keys(value).length) {
        return [''];
      }
      return Object.keys(value).map((key) => ({
        [key]: value[key],
      }));
    }

    if (Array.isArray(value) && value.length) {
      return value.map((item) => item);
    }
    return [''];
  }

  formatResultByMode(val) {
    const { mode } = this.props;
    let tempVal = val;
    if (mode === 'map') {
      tempVal = {};
      val.forEach((item) => {
        tempVal = Object.assign(tempVal, item);
      });
    }
    return tempVal;
  }

  handleChange(val, options) {
    const { onChange } = this.props;
    const tempValue = this.state.value;
    const { index } = options;
    const changeValue = val;
    tempValue[index] = { ...tempValue[index], ...changeValue };
    this.setState({
      value: tempValue,
    });
    if (onChange) {
      onChange(this.formatResultByMode(tempValue));
    }
  }

  handleClickAdd(e) {
    const { value } = this.state;
    value.push('');
    this.setState({
      value,
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  handleClickRemove(e) {
    const { value } = this.state;
    const index = parseInt(e.currentTarget.dataset.index);
    if (value.length) {
      if (index > 0) {
        value.splice(parseInt(index), 1);
      } else {
        value.shift();
      }
      this.setState({
        value,
      });

      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  renderRows() {
    const { comp, onChange, ...others } = this.props;
    const Comp = comp;
    const { value } = this.state;
    return value.map((val, index) => (
      <Row key={`row-${index}`} className="compgroup__row">
        <Col
          className="compgroup__input"
        >
          <Comp
            {...others}
            data-index={index}
            value={val}
            onChange={this.handleChange}
          />
        </Col>
        <Col
          className="compgroup__handle"
        >
          {
            value.length > 1 && (
            <MinusCircleOutlined
              className="compgroup__remove compgroup__action"
              data-index={index}
              onClick={this.handleClickRemove}
            />
            )
          }
          <PlusCircleOutlined
            className="compgroup__add compgroup__action"
            onClick={this.handleClickAdd}
          />
        </Col>
      </Row>
    ));
  }

  render() {
    const {
      className, value, onChange, comp, viewRender, ...others
    } = this.props;
    return (
      <div
        className={`compgroup ${className}`}
        {...others}
      >
        {this.renderRows()}
      </div>
    );
  }
}

export default GroupComponent;
