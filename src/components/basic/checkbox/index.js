import React, { Component, Fragment } from 'react';
import { Checkbox } from 'antd';
import handleChange from '../../../utils/decorators/handle-change';

const CheckboxGroup = Checkbox.Group;

@handleChange()
class CheckboxWrapper extends Component {
  static defaultProps = {
    showIndeterminate: false,
  }

  state = {
    indeterminate: false,
    checkAll: false,
  }

  onChange = (checkedList) => {
    const { options } = this.props;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < options.length,
      checkAll: checkedList.length === options.length,
    });
    this.handleChange(checkedList);
  }

  onCheckAllChange = (e) => {
    const { options } = this.props;
    const checkedList = e.target.checked ? options : [];
    this.setState({
      checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    });
    this.handleChange(checkedList);
  }

  render() {
    const { indeterminate, checkAll, checkedList } = this.state;
    const {
      value, mode, title, options, showIndeterminate, ...others
    } = this.props;
    if (mode === 'group') {
      return (
        <Fragment>
          {
            showIndeterminate && (
              <Checkbox
                indeterminate={indeterminate}
                onChange={this.onCheckAllChange}
                checked={checkAll}
              >
                全部
              </Checkbox>
            )
          }
          <CheckboxGroup
            options={options}
            value={checkedList}
            onChange={this.onChange}
          />
        </Fragment>
      );
    }
    return (
      <Checkbox
        {...others}
        checked={!!value}
        onChange={this.handleChange}
      >
        {title}
      </Checkbox>
    );
  }
}

export default CheckboxWrapper;
