import React, { Component, createRef } from 'react';
import style from './index.css';
import { Button, Modal, Form, Input, Select } from 'antd';
import * as Icon from '@ant-design/icons';
import { Layout } from '../content';

const {
  EditOutlined,
  FileAddOutlined,
  SaveOutlined,
  RollbackOutlined,
  ShopOutlined,
} = Icon;
const FormItem = Form.Item;
const options = Array.from(
  { length: 13 },
  (value, key) => key + 4,
).map((item) => ({ label: item, value: item }));
const validateMessages = {
  required: '请输入${label}',
};

interface GroupModal {
  w: number;
  h: number;
  title: string;
}

interface Props {
  handleEdit: () => void;
  isEdit: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  handleShopToggle: (show: boolean) => void;
  handleAddGroup: (item: Layout) => void;
}

interface State {
  isModalShow: boolean;
}

// 右下角的操作栏
export default class ActionArea extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalShow: false,
    };
  }

  private modalFormEle: any = createRef();

  render() {
    const {
        handleEdit,
        isEdit,
        handleSave,
        handleCancel,
        handleShopToggle,
      } = this.props,
      { isModalShow } = this.state;
    return (
      <div className={style['actionWrap']}>
        {!isEdit ? (
          <Button
            size={'large'}
            type={'primary'}
            icon={<EditOutlined />}
            onClick={handleEdit}
            title={'编辑'}
          />
        ) : null}
        {isEdit ? (
          <Button
            className={style['l-button']}
            size={'large'}
            type={'primary'}
            icon={<FileAddOutlined />}
            onClick={() => this.setState({ isModalShow: true })}
            title={'新建分组'}
          />
        ) : null}
        {isEdit ? (
          <Button
            className={style['l-button']}
            size={'large'}
            type={'primary'}
            icon={<SaveOutlined />}
            onClick={handleSave}
            title={'保存'}
          />
        ) : null}
        {isEdit ? (
          <Button
            className={style['l-button']}
            size={'large'}
            type={'primary'}
            icon={<RollbackOutlined />}
            onClick={handleCancel}
            title={'取消'}
          />
        ) : null}
        {isEdit ? (
          <Button
            size={'large'}
            type={'primary'}
            icon={<ShopOutlined />}
            onClick={() => handleShopToggle(true)}
            title={'磁贴商店'}
          />
        ) : null}
        {/*弹窗创建新的分组*/}
        {isModalShow && (
          <Modal
            visible={true}
            width={380}
            title={'新建分组'}
            cancelText={'取消'}
            okText={'确认'}
            onCancel={() => this.setState({ isModalShow: false })}
            onOk={this.handleOk}
          >
            <Form
              ref={this.modalFormEle}
              validateMessages={validateMessages}
              initialValues={{ title: '', w: 4, h: 4 }}
            >
              <FormItem
                label={'标题'}
                name={'title'}
                required={true}
                rules={[{ required: true }]}
              >
                <Input />
              </FormItem>
              <div className={style['l-formItemWrap']}>
                <FormItem
                  label={'尺寸'}
                  className={style['formItem--left']}
                  required={true}
                >
                  <FormItem noStyle={true} name={'w'}>
                    <Select style={{ width: '80%' }} options={options} />
                  </FormItem>
                  宽
                </FormItem>
                <span>×</span>
                <FormItem className={style['formItem--right']}>
                  <FormItem noStyle={true} required={true} name={'h'}>
                    <Select
                      style={{ width: '80%' }}
                      options={options.slice(0, 7)}
                    />
                  </FormItem>
                  高
                </FormItem>
              </div>
            </Form>
          </Modal>
        )}
      </div>
    );
  }

  // 点击确认新增分组
  handleOk = async () => {
    const params = await this.handleValidate();
    if (params) {
      this.props.handleAddGroup({
        i: new Date().getTime().toString(),
        ...params,
        minW: 4,
        minH: 4,
        x: 0,
        y: 100,
        type: 'group',
        children: [],
      });
      this.setState({ isModalShow: false });
    }
  };

  // 验证
  handleValidate = () => {
    return this.modalFormEle.current
      .validateFields()
      .then((res: GroupModal) => res)
      .catch((err: Error) => {
        console.log(err);
        return null;
      });
  };
}
