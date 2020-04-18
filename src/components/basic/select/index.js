import React, { Component } from 'react';
import fetch from 'axios';
import classnames from 'classnames';
import { Select } from 'antd';
import asyncFeedback from '../async-feedback';

import styles from './index.module.less';
import { NotUndefinedOrNull } from '../../../utils';

const { Option } = Select;

class AsyncSelect extends Component {
  static defaultProps = {
    option: [],
    optionFilterProp: 'children',
  }

  constructor(props) {
    super(props);
    this.state = {
      option: props.option,
    };
  }

  async componentDidMount() {
    const { asyncUrl, parentKey, parentValue } = this.props;
    if (asyncUrl) {
      if (!parentKey) {
        await this.fetchOptions(asyncUrl);
      } else if (parentValue) {
        await this.fetchOptions(`${asyncUrl}?${parentKey}=${parentValue}`);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { asyncUrl, parentValue, onFetchReady } = this.props;
    if (nextProps.parentValue !== parentValue) {
      fetch({
        method: 'GET',
        url: `${asyncUrl}/${nextProps.parentValue}`,
      }).then((res) => {
        if (res.status !== 200 || !res.data.success) {
          const errMsg = res.response.data.message || res.message || res.data.errorMsg;
          asyncFeedback.error(errMsg);
        } else {
          this.setState({
            option: res.data.data,
          });
          if (onFetchReady) {
            onFetchReady(res.data.data);
          }
        }
      });
    }
  }

  async fetchOptions(asyncUrl) {
    const { onFetchReady } = this.props;
    let res = {};
    try {
      res = await fetch({
        method: 'GET',
        url: asyncUrl,
      });
    } catch (e) {
      res = e;
    }

    if (res.status !== 200 || !res.data.success) {
      const errMsg = res.message || res.data.errorMsg;
      asyncFeedback.error(errMsg);
    } else {
      this.setState({
        option: res.data.data,
      });
      if (onFetchReady) {
        onFetchReady(res.data.data);
      }
    }
  }

  formatValue() {
    const {
      value, mode,
    } = this.props;
    let tempValue = value;
    if (mode === 'multiple' || mode === 'tags') {
      if (tempValue && !Array.isArray(tempValue)) {
        tempValue = [tempValue];
      } else if (!tempValue) {
        tempValue = [];
      }
      return tempValue;
    }

    if (!mode && Array.isArray(tempValue)) {
      tempValue = tempValue[0];
    }

    if (NotUndefinedOrNull(tempValue)) {
      return `${tempValue}`;
    }
    return undefined;
  }

  render() {
    const {
      asyncUrl, formProps, value, title, placeholder, className, ...others
    } = this.props;

    const option = asyncUrl ? this.state.option : this.props.option;
    const parsedValue = this.formatValue();

    const classNames = classnames(className, styles.select);


    // if (!(option.length)) {
    //   return (
    //     <Select
    //       disabled
    //       className={classNames}
    //     />
    //   );
    // }
    others.value = parsedValue;
    return (
      <Select
        {...others}
        placeholder={title || placeholder}
        className={classNames}
      >
        {
          option.map((opt) => {
            const { key } = opt;
            return (<Option value={`${key}`} key={key}>{opt.value}</Option>);
          })
        }
      </Select>
    );
  }
}

export default AsyncSelect;
