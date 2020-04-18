import React from 'react';
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
import CheckboxWrapper from '../components/basic/checkbox';
import { GetValueByKey } from '.';

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
  const { key, data } = props;
  const value = GetValueByKey(data, key);

  return (
    <span>{value}</span>
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

const getComponent = (props) => {
  const {
    compType, initialValue, viewRender, ...others
  } = props;

  if (compType === 'map') {
    return getMap(others);
  }
  if (compType === 'span') {
    return getSpan(others);
  }
  if (compType === 'button') {
    return getButton(others);
  }
  if (compType === 'input') {
    return getInput(others);
  }
  if (compType === 'textarea') {
    return getTextArea(others);
  }
  if (compType === 'image') {
    return getImage(others);
  }

  if (compType === 'imagePicker') {
    return getImagePicker(others);
  }

  if (compType === 'richtext') {
    return getRichText(others);
  }
  if (compType === 'checkbox') {
    return getCheckbox(others);
  }
  if (compType === 'file') {
    return getFiles(others);
  }
  if (compType === 'select') {
    return getSelect(others);
  }
  if (compType === 'switch') {
    return getSwitch(others);
  }
  if (compType === 'label') {
    return getLabel(others);
  }
  if (compType === 'date') {
    return getDatepicker(others);
  }
  if (compType === 'table') {
    return getTable(others);
  }

  if (compType === 'cascade') {
    return getCascade(others);
  }

  if (compType === 'keyValuePair') {
    return getKeyValuePair(others);
  }

  return null;
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
