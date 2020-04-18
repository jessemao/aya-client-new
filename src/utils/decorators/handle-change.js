function handleChange() {
  return function commponet(Component) {
    // eslint-disable-next-line
    class HandleChange extends Component {
      constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
      }

      handleChange(e) {
        const { onValuesChange } = this.props;
        let tempValue;
        if (e && e.target && typeof e.target.value !== 'undefined') {
          tempValue = e.target.value;
        } else {
          tempValue = e;
        }

        const options = {};
        Object.keys(this.props).filter((key) => key.indexOf('data-') > -1).forEach((key) => {
          const keyProp = key.split('-')[1];
          options[keyProp] = this.props[key];
        });

        if (super.handleChange) {
          tempValue = super.handleChange(tempValue, options);
        }

        if (onValuesChange) {
          onValuesChange(tempValue, options);
        }
      }
    }

    return HandleChange;
  };
}

export default handleChange;
