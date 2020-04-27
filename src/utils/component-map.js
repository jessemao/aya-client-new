import React from 'react';
import { Form } from 'antd';
import InputNumber from '../components/basic/input-number';
import InputPassword from '../components/basic/input-password';
import Button from '../components/basic/button';
import Input from '../components/basic/input';
import ImageUploader from '../components/basic/upload-image';
import Label from '../components/basic/label';
import FileUploader from '../components/basic/file-uploader-form';
import RichText from '../components/basic/rich-text';
import TextArea from '../components/basic/textarea';
import Select from '../components/basic/select';
import Switch from '../components/basic/switch';
import Table from '../components/basic/table';
import ImageUploaderMulti from '../components/basic/upload-image-multi';
import DatePicker from '../components/basic/datepicker';
import ImagePicker from '../components/basic/image-picker';
import GroupComponent from '../components/basic/component-group';
import MapComponent from '../components/basic/map';
import KeyValuePairComponent from '../components/basic/key-value-pair';
import CascadeComponent from '../components/basic/cascade';
import TimePicker from '../components/basic/time-picker';
import Span from '../components/basic/span';
import CheckboxWrapper from '../components/basic/checkbox';

const FormItem = Form.Item;


function getTextArea(props) {
  const {
    mode, dataType, validateRule, ...others
  } = props;
  if (props.mode === 'multiple') {
    return (
      <GroupComponent
        comp={TextArea}
        placeholder={props.title}
        {...others}
      />
    );
  }
  return (
    <TextArea
      placeholder={props.title}
      {...others}
    />
  );
}

function getSpan(props) {
  return (
    <Span {...props} />
  );
}

function getButton(props) {
  return <Button {...props} />;
}

function getInput(props) {
  const {
    mode, dataType, validateRule, ...others
  } = props;
  if (dataType === 'tel' || dataType === 'number') {
    if (props.mode === 'multiple') {
      return (
        <GroupComponent
          comp={InputNumber}
          placeholder={props.title}
          {...others}
        />
      );
    }

    return (
      <InputNumber
        placeholder={props.title}
        {...others}
      />
    );
  }

  if (dataType === 'password') {
    return (
      <InputPassword
        placeholder={props.title}
        {...others}
      />
    );
  }

  if (mode === 'multiple') {
    return (
      <GroupComponent
        comp={Input}
        placeholder={props.title}
        mode={mode}
        {...others}
      />
    );
  }
  return (
    <Input
      placeholder={props.title}
      {...others}
    />
  );
}


function getMap(props) {
  const {
    mode, mapType, ...others
  } = props;
  if (mode === 'multiple' || mode === 'map') {
    return (
      <GroupComponent
        comp={MapComponent}
        components={mapType}
        mode={mode}
        {...others}
      />
    );
  }
  return (
    <MapComponent
      components={mapType}
      {...others}
    />
  );
}

function getCascade(props) {
  const {
    children, ...others
  } = props;
  return (
    <CascadeComponent
      components={children}
      {...others}
    />
  );
}

function getImage(props) {
  const {
    mode, ...others
  } = props;

  if (mode === 'multiple') {
    return (
      <ImageUploaderMulti
        {...others}
      />
    );
  }
  return (
    <ImageUploader
      {...props}
    />
  );
}

function getRichText(props) {
  return (
    <RichText {...props} />
  );
}

function getFiles(props) {
  return (
    <FileUploader
      action={props.uploadUrl}
      {...props}
    />
  );
}

function getCheckbox(props) {
  return (
    <CheckboxWrapper
      {...props}
    />
  );
}

function getSelect(props) {
  return (
    <Select
      {...props}
    />
  );
}

function getSwitch(props) {
  const { mode, ...others } = props;
  if (mode === 'multiple') {
    return (
      <GroupComponent
        comp={Switch}
        placeholder={props.title}
        {...others}
      />
    );
  }

  return (
    <Switch
      {...props}
    />
  );
}

function getImagePicker(props) {
  return (
    <ImagePicker {...props} />
  );
}

function getDatepicker(props) {
  const { mode, ...others } = props;
  if (mode === 'multiple') {
    return (
      <GroupComponent
        comp={DatePicker}
        placeholder={props.title}
        {...others}
      />
    );
  }

  return (
    <DatePicker
      {...props}
    />
  );
}

function getTimePicker(props) {
  return (
    <TimePicker {...props} />
  );
}

function getTable(props) {
  return (
    <Table
      {...props}
    />
  );
}

function getLabel(props) {
  return (
    <Label
      {...props}
    />
  );
}

function getKeyValuePair(props) {
  const {
    mode, mapType, ...others
  } = props;
  if (mode === 'multiple') {
    return (
      <GroupComponent
        comp={KeyValuePairComponent}
        components={mapType}
        mode={mode}
        {...others}
      />
    );
  }
  return (
    <KeyValuePairComponent
      components={mapType}
      {...others}
    />
  );
}

const getComponent = (props, formProps) => {
  const {
    compType, initialValue, viewRender, ...others
  } = props;

  let Comp = null;
  if (compType === 'map') {
    Comp = getMap(others);
  } else if (compType === 'span') {
    Comp = getSpan(others);
  } else if (compType === 'button') {
    Comp = getButton(others);
  } else if (compType === 'input') {
    Comp = getInput(others);
  } else if (compType === 'textarea') {
    Comp = getTextArea(others);
  } else if (compType === 'image') {
    Comp = getImage(others);
  } else if (compType === 'imagePicker') {
    Comp = getImagePicker(others);
  } else if (compType === 'richtext') {
    Comp = getRichText(others);
  } else if (compType === 'checkbox') {
    Comp = getCheckbox(others);
  } else if (compType === 'file') {
    Comp = getFiles(others);
  } else if (compType === 'select') {
    Comp = getSelect(others);
  } else if (compType === 'switch') {
    Comp = getSwitch(others);
  } else if (compType === 'label') {
    Comp = getLabel(others);
  } else if (compType === 'date') {
    Comp = getDatepicker(others);
  } else if (compType === 'time') {
    Comp = getTimePicker(others);
  } else if (compType === 'table') {
    Comp = getTable(others);
  } else if (compType === 'cascade') {
    Comp = getCascade(others);
  } else if (compType === 'keyValuePair') {
    Comp = getKeyValuePair(others);
  }
  return (
    <FormItem
      {...formProps}
    >
      {Comp}
    </FormItem>
  );
};


// function getFormItem(props, options = {}) {
//   // data -- object with propsKey
//   // value -- initial value for component
//   const {
//     data, validateRule,
//   } = props;

//   const component = getComponent(props);
//   if (!component) {
//     return null;
//   }

//   // if value exists, use value directly
//   // const selectedData = data || {};

//   // initialValue = NotUndefinedOrNull(initialValue)
//     // ? initialValue : GetValueByKey(selectedData, props.key, props.compType);


//   // const fieldOption = { initialValue, ...options, ...validateRule };

// }

export {
  getComponent,
  // getFormItem,
};
