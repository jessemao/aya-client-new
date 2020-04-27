import React, { Component, Fragment } from 'react';
import { Card, Button, Modal } from 'antd';

import { observer } from 'mobx-react';
import { getSearchQuery, toFixed } from '../../utils';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import DescriptionCard from '../../components/DescriptionCard';
import ConfirmModal from '../../components/ConfirmModal';
import ReservationRecordStore from '../../stores/ReservationRecordStore';
// import { EVENT_USER_STATUS, RESERVATION_STATUS } from '../../constants/status';

import styles from './index.module.less';
import OrderStore from '../../stores/OrderStore';
import AccountStore from '../../stores/AccountStore';
import { EVENT_USER_STATUS, RESERVATION_STATUS } from '../../constants/order';

const REFUNDABLE_INFO = [
  {
    key: 'deposit',
    title: '押金',
  },
  {
    key: 'total',
    title: '消费金额',
    viewRender(val, { data }) {
      return toFixed(val - data.deposit);
    },
  },
  {
    key: 'total',
    title: '可退总金额',
  },
];

const BASIC_INFO = [
  {
    key: 'name',
    title: '预约名称',
  },
  {
    key: 'reservationNumber',
    title: '预约单号',
  },
  {
    key: 'storeId.name',
    title: '场地',
  },
  {
    key: 'accountId.basicInfo',
    title: '预约人昵称',
    viewRender(val) {
      if (!val) {
        return null;
      }
      return val.nickName || val.fullname;
    },
  },
  {
    key: 'status',
    title: '预约状态',
    viewRender(val) {
      if (!val) {
        return null;
      }
      return EVENT_USER_STATUS[val];
    },
  },
];

const ORDER_INFO = [
  {
    key: 'orderId.orderNumber',
    title: '订单号',
  },
  {
    key: 'orderId',
    title: '场地使用费',
    viewRender(val) {
      if (!val) {
        return null;
      }
      return toFixed(val.subtotal - val.deposit);
    },
  },
  {
    key: 'orderId.deposit',
    title: '订单押金',
  },

  {
    key: 'orderId.subtotal',
    title: '订单折后总价',
  },
  {
    key: 'orderId.total',
    title: '订单总价',
  },
];

const REFUNDING_INFO = [
  {
    key: 'refundNumber',
    title: '退款号',
  },

  {
    key: 'initiatedBy.basic',
    title: '申请人',
    viewRender(val) {
      if (!val) {
        return null;
      }
      return val.fullname || val.nickName;
    },
  },
  {
    key: 'createdAt',
    title: '申请创建时间',
    viewRender(val) {
      return new Date(val).toLocaleString();
    },
  },
  {
    key: 'refundSubtotal',
    title: '待退总费用',
  },
  {
    key: 'refundSubtotal',
    title: '待退使用费',
    viewRender(val, { data }) {
      return toFixed(val - data.refundDeposit);
    },
  },
  {
    key: 'refundDeposit',
    title: '待退押金',
  },
];

@observer
class ReservationRefundPage extends Component {
  state = {
    showApplyBtn: true,
    refundablePanel: false,
    refundRecordPanel: false,
    confirmModalVisible: false,
  }

  async componentDidMount() {
    this.reservationId = getSearchQuery('id');
    ReservationRecordStore.SetSelectedItemById(this.reservationId);
    await ReservationRecordStore.FetchItem(this.reservationId);
    const { selectedItem } = ReservationRecordStore;

    const { orderId = {} } = selectedItem;
    const { status } = orderId;
    const applyBtnFlag = !(status === RESERVATION_STATUS.REFUNDING || status === RESERVATION_STATUS.CANCELED || status === RESERVATION_STATUS.EXPIRED || status === RESERVATION_STATUS.REFUNDED);
    if (status === RESERVATION_STATUS.REFUNDING) {
      OrderStore.FetchRefundingInfo(orderId._id);
    }
    this.setState({
      showApplyBtn: applyBtnFlag,
      refundRecordPanel: status === RESERVATION_STATUS.REFUNDING,
    });
  }

  handleClickReview = () => {
    const { selectedItem } = ReservationRecordStore;
    const { orderId } = selectedItem;
    OrderStore.GetRefundableFee(orderId._id);
    this.setState({
      showApplyBtn: false,
      refundablePanel: true,
    });
  }

  handleOk = (fields) => {
    OrderStore.RefundOrder(fields);
    this.setState({
      confirmModalVisible: false,
    });
  }

  handleClickConfirmRefund = () => {
    this.setState({
      confirmModalVisible: true,
    });
  }

  handleInitiateRefundConfirm = async () => {
    const { selectedItem } = ReservationRecordStore;
    const { orderId } = selectedItem;
    const res = await OrderStore.InitRefund(orderId._id);
    if (!res) {
      return;
    }
    this.setState({
      refundablePanel: false,
      refundRecordPanel: true,
    });
  }

  handleInitiateRefund = () => {
    const { refundableFee } = OrderStore;
    const { deposit, subtotal, total } = refundableFee;
    let modalContent = '';
    const usageFee = toFixed(subtotal - deposit);
    if (deposit) {
      modalContent = `您正在发起退款，总金额￥${subtotal}，押金￥${deposit}，使用费￥${usageFee}`;
    } else {
      modalContent = `您正在发起退款，总金额￥${subtotal}，使用费￥${usageFee}`;
    }

    Modal.confirm({
      title: '确认发起退款',
      content: modalContent,
      onOk: this.handleInitiateRefundConfirm,
    });
  }

  handleRefundCaptcha = () => {
    const { selectedItem } = ReservationRecordStore;
    const { orderId } = selectedItem;
    OrderStore.RequestRefundCaptcha(orderId._id);
  }

  handleCancel = () => {
    this.setState({
      confirmModalVisible: false,
    });
  }

  renderRefundRecordPanel() {
    const { refundingOrder } = OrderStore;
    const { refundRecordPanel } = this.state;
    if (!refundRecordPanel || refundingOrder.status !== RESERVATION_STATUS.REFUNDING) {
      return null;
    }

    return (
      <DescriptionCard
        title="待审核退款信息"
        selectedItem={refundingOrder}
        viewFields={REFUNDING_INFO}
      >
        <Button type="primary" onClick={this.handleClickConfirmRefund}>确认退款</Button>
      </DescriptionCard>
    );
  }

  renderRefundablePanel() {
    const { refundableFee } = OrderStore;
    const { refundablePanel } = this.state;
    if (!refundablePanel) {
      return null;
    }
    return (
      <DescriptionCard
        title="可退款信息"
        selectedItem={refundableFee}
        viewFields={REFUNDABLE_INFO}
      >
        <Button type="primary" onClick={this.handleInitiateRefund}>申请退款</Button>
      </DescriptionCard>
    );
  }

  renderApplyButton() {
    const { showApplyBtn } = this.state;
    if (!showApplyBtn) {
      return null;
    }

    return (
      <Card className={styles.applyBtnWrapper}>
        <Button type="primary" onClick={this.handleClickReview}>查看可退金额</Button>
      </Card>
    );
  }

  render() {
    const { selectedItem } = ReservationRecordStore;
    const { currentUser = {} } = AccountStore;
    const { confirmModalVisible } = this.state;
    const { basicInfo = {} } = currentUser;
    const { phoneNumber } = basicInfo;
    const { refundableFee } = OrderStore;

    return (
      <PageHeaderWrapper>
        <DescriptionCard
          title="预约信息"
          selectedItem={selectedItem}
          viewFields={BASIC_INFO}
        />
        <DescriptionCard
          title="订单信息"
          selectedItem={selectedItem}
          viewFields={ORDER_INFO}
        />
        {
          this.renderApplyButton()
        }
        {
          this.renderRefundablePanel()
        }
        {
          this.renderRefundRecordPanel()
        }
        <ConfirmModal
          visible={confirmModalVisible}
          title="确认申请退款"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          onCaptcha={this.handleRefundCaptcha}
          refundableFee={refundableFee}
          countdown={60}
          phoneNumber={phoneNumber}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ReservationRefundPage;
