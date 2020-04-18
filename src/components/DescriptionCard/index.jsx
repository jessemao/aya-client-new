import {
  Descriptions,
  Divider,
  Card,
  Switch,
  Button,
  Form,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { GetValueByKey, getComponent } from '../../utils/component-map';

import styles from './index.module.less';

const DescriptionsItem = Descriptions.Item;

const FormItem = Form.Item;

class DescriptionCard extends Component {
  formRef = React.createRef();

  static defaultProps = {
    canEdit: false,
    checkedChildren: '编辑',
    uncheckedChildren: '查看',
    selectedItem: {},
    editFields: [],
    viewFields: [],
    column: 3,
    onOk: () => {},
    title: '',
  }

  state = {
    editState: false,
  }

  handleChangeSwitch = (value) => {
    this.setState({
      editState: value,
    });
  }

  convertToEditFields = (fields) => fields.map((field) => {
    const tempField = { ...field };
    if (tempField.compType && !field.render) {
      tempField.render = (value) => {
        const props = { ...field, name: field.key, initialValue: value };
        return getComponent(props);
      };
    }
    return tempField;
  })

  handleOk = () => {
    const { onOk } = this.props;
    this.formRef.current.validateFields().then((err, fieldsValue) => {
      if (err) return;
      this.formRef.current.resetFields();
      if (onOk) {
        onOk(fieldsValue);
      }
      this.setState({
        editState: false,
      });
    });
  }

  renderInfo(fields) {
    const { selectedItem } = this.props;
    const { editState } = this.state;
    if (!(selectedItem && selectedItem._id)) {
      return (<div />);
    }

    return fields.map((info) => {
      let itemValue = GetValueByKey(selectedItem, info.key);

      if (info.valueMap) {
        itemValue = info.valueMap[itemValue];
      }

      const render = editState ? info.render : info.viewRender;

      const content = render ? render(itemValue, { form: this.formRef.current, data: selectedItem }) : itemValue;

      const itemLabelAndLayout = { wrapperCol: { span: 24 }, ...info.layout };

      return (
        <DescriptionsItem
          key={info.key}
          label={info.title}
        >
          {
            info.compType && (
              <Form
                ref={this.formRef}
              >
                <FormItem
                  key={info.key}
                  {...itemLabelAndLayout}
                >
                  {content}
                </FormItem>
              </Form>
            )
          }
          {
            !info.compType && content
          }

        </DescriptionsItem>
      );
    });
  }

  render() {
    const {
      canEdit, checkedChildren, uncheckedChildren, editFields, viewFields, title, column,
    } = this.props;

    const { editState } = this.state;

    let customFields;
    if (editState) {
      if (editFields.length) {
        customFields = editFields;
      } else {
        customFields = this.convertToEditFields(viewFields);
      }
    } else {
      customFields = viewFields;
    }

    return (
      <Card className={styles.card}>
        <Descriptions
          title={title}
          column={column}
        >
          {this.renderInfo(customFields)}
        </Descriptions>
        {
          canEdit && (
            <Switch
              className={styles.switchBtn}
              checkedChildren={checkedChildren}
              unCheckedChildren={uncheckedChildren}
              checked={editState}
              onChange={(value) => {
                this.handleChangeSwitch(value);
              }}
            />
          )
        }
        {
          (canEdit && editState) && (
            <div className={styles.editBtnWrap}>
              <Button
                className={styles.editBtn}
                onClick={this.handleOk}
                type="primary"
              >
                确认
              </Button>
            </div>
          )
        }
      </Card>
    );
  }
}

export default DescriptionCard;
