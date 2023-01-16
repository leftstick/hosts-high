import { Form, Input, Modal } from 'antd';
import type { RuleObject } from 'antd/es/form';
import React, { useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface IValidator {
  (rule: RuleObject, value: string): Promise<Error | null>;
}

export interface IPopupInputProps {
  title: string;
  type: 'input' | 'password';
  validator: IValidator | null;
  open: boolean;
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onConfirm?: (e: string) => Promise<void>;
}

export function PopupInputModal({
  title,
  type,
  validator,
  open,
  onCancel,
  onConfirm,
}: IPopupInputProps) {
  const [loading, setLoading] = useState(false);
  const [inputForm] = Form.useForm();
  const doSubmit = useCallback(async () => {
    const values = await inputForm.validateFields();
    if (onConfirm) {
      setLoading(true);
      onConfirm(values.value).finally(() => {
        setLoading(false);
      });
    }
  }, [inputForm, onConfirm]);

  const finalInput = useMemo(() => {
    if (type === 'input') {
      return <Input autoFocus />;
    }
    if (type === 'password') {
      return <Input.Password autoFocus />;
    }
    return null;
  }, [type]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      okButtonProps={{ type: 'primary', htmlType: 'submit', loading }}
      onOk={doSubmit}
    >
      <Form
        form={inputForm}
        name="ask-input-value"
        onFinish={doSubmit}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name="value" rules={validator ? [{ validator }] : []}>
          {finalInput}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export function showPopupInput(
  title: string,
  type: 'input' | 'password',
  onConfirm: (e: string) => Promise<void>,
  validator: IValidator | null,
) {
  const div = document.createElement('div');

  document.body.appendChild(div);
  const root = createRoot(div); // createRoot(container!) if you use TypeScript

  const destroy = () => {
    root.unmount();
  };

  const value = new Promise<string>((resolve) => {
    root.render(
      <PopupInputModal
        title={title}
        validator={validator}
        open
        type={type}
        onCancel={destroy}
        onConfirm={(e) => {
          resolve(e);
          return onConfirm(e);
        }}
      />,
    );
  });

  return {
    destroy,
    value,
  };
}
