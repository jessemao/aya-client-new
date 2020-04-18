import React from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
// import TableImage from '../components/table-image';

function getRenderNode({
  value, populateKey, prop,
}) {
  let nodeValue = value;
  if (Array.isArray(value)) {
    if (prop.showMultiple) {
      nodeValue = value.map((rcd) => rcd[populateKey]).join('<br/>');
    } else {
      nodeValue = (value[0] && value[0][populateKey]);
    }
  } else {
    nodeValue = (
      value && value[populateKey]
    );
  }
  return nodeValue;
}

function getRenderNodeForColumn({
  text, record, populateKey, columnKey, prop,
} = {}) {
  let node = {};
  let nodeValue = text;
  if (Array.isArray(text)) {
    nodeValue = text.join('<br/>');
  }
  if (columnKey) {
    nodeValue = getRenderNode({ value: record[columnKey], populateKey, prop });
  }

  // console.log('record', record);
  // console.log('column', columnKey);
  // console.log('node', nodeValue);

  if (prop.subKey) {
    if (Array.isArray(nodeValue) && nodeValue[0]) {
      nodeValue = nodeValue[0][prop.subKey];
    } else {
      nodeValue = nodeValue[prop.subKey];
    }
  }

  if (prop.compType) {
    switch (prop.compType) {
      case 'date':
        node = moment(nodeValue).format('YYYY-MM-DD h:mm:ss');
        break;
      case 'richtext':
        node = (<span dangerouslySetInnerHTML={{ __html: nodeValue }} />);
        break;
      case 'image':
        // node = (<TableImage src={nodeValue} />);
        break;
      case 'avatar':
        node = (<Avatar src={nodeValue} />);
        break;
      default:
        node = nodeValue;
        break;
    }
  } else {
    node = nodeValue;
  }


  if (prop.displayMap) {
    return prop.displayMap[nodeValue];
  }

  return node;
}

function getColumnByProps(title, key, prop) {
  const columnProps = {
    key,
    title,
    dataIndex: key,
    className: `col-${key} col`,
  };
  let columnRender = {};
  // if data is populated, then we need to get specific field for.
  if (prop.populateKey) {
    // if field value is an array, we need to go through it and get a grouped column.
    if (Array.isArray(prop.populateKey)) {
      columnRender = {
        children: prop.populateKey.map((item) => ({
          title: item.title,
          dataIndex: item.key,
          key: item.key,
          render: (text, record) => {
            const tempRecord = { ...record };
            if (prop.dataType && prop.dataType === 'map') {
              tempRecord[key] = Object.keys(record[key]).map((objKey) => ({
                [prop.populateKey[0].key]: objKey,
                [prop.populateKey[1].key]: record[key][objKey],
              }));
            }
            return getRenderNodeForColumn({
              text, record: tempRecord, populateKey: item.key, columnKey: key, prop: item,
            });
          },
          ...item.columnProps,
        })),
      };
    } else {
      // else, we just pick the correct value to display
      columnRender = {
        render: (text, record) => getRenderNodeForColumn({
          text, record, populateKey: prop.populateKey, columnKey: key, prop,
        }),
        ...prop.columnProps,
      };
    }
  } else {
    // if there is no populate fields, then we display the value directly.
    columnRender = {
      render: (text, record) => getRenderNodeForColumn({
        text, record, prop,
      }),
      ...prop.columnProps,
    };
  }

  return { ...columnProps, ...columnRender };
}


const propertiesToTableColumn = (properties, { displayColumns = [], customColumn = {} } = {}) => {
  // title dataIndex key
  const mapProps = properties.map((prop) => {
    let keys = [prop.key];
    let titles = [prop.title];

    // for i18n.
    if (prop.$i18n) {
      keys = [`${prop.key}_en`, `${prop.key}_zh`];
      titles = [`${prop.title}(EN)`, `${prop.title}(中文)`];
    }

    // get i18n values.
    return keys.map((key, index) => {
      const propsData = Object.assign(getColumnByProps(titles[index], key, prop), customColumn[key]);

      return propsData;
    });
  }).reduce((a, b) => a.concat(b), []);

  if (displayColumns.length && mapProps.length) {
    return displayColumns.map((key) => mapProps.find((item) => item.key === key)).filter((item) => !!item);
  }
  return mapProps;
};

export {
  propertiesToTableColumn,
  getRenderNode,
};
