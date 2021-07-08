import React, { useState, useRef } from 'react'
import { Button, Drawer, Form, Input, Tooltip } from 'antd'
import { useModel } from 'umi'

import { isIp, isDomains } from '@/helpers'
import { IHost } from '@/IType'

function CreateHost() {
  const [form] = Form.useForm()
  const inputEl = useRef<Input>(null)
  const [drawerVisable, setDrawerVisable] = useState(false)
  const { acquired } = useModel('usePermissionModel')
  const { createHost } = useModel('useHostsModel')

  if (!acquired) {
    return (
      <Tooltip placement="left" title="Please acquire permission first">
        <Button disabled>Create</Button>
      </Tooltip>
    )
  }

  function saveHost(values: { [name: string]: any }) {
    const vals = values.host.split('/')
    const host: IHost = {
      ip: vals[0],
      domain: vals[1],
      alias: vals[2] && vals[2].trim(),
      disabled: false,
    }
    createHost(host).then(() => {
      form.resetFields()
      setDrawerVisable(false)
    })
  }

  return (
    <>
      <Button
        disabled={!acquired}
        onClick={() => {
          setDrawerVisable(!drawerVisable)
        }}
      >
        Create
      </Button>
      <Drawer
        visible={drawerVisable}
        closable
        placement="bottom"
        height={220}
        title="Add host"
        onClose={() => {
          setDrawerVisable(false)
        }}
        afterVisibleChange={(vis) => {
          vis && inputEl.current!.focus()
        }}
      >
        <Form onFinish={saveHost} form={form}>
          <Form.Item
            name="host"
            rules={[
              {
                required: true,
                message: 'Please input your host!',
              },
              {
                validator(rule, value) {
                  const vals = value.split('/')
                  if (vals.length < 2 || vals.length > 3) {
                    return Promise.reject(`incorrect format: '/' should be delimiter, and separated into [2,3] pieces`)
                  }
                  if (!vals[0]) {
                    return Promise.reject('ip must be specified')
                  }
                  if (!vals[1]) {
                    return Promise.reject('domain must be specified')
                  }
                  if (!isIp(vals[0])) {
                    return Promise.reject('incorrect ip format')
                  }
                  if (!isDomains(vals[1])) {
                    return Promise.reject('incorrect domain format, multiple domains can be separated via space')
                  }
                  if (vals[2] && vals[2].length > 15) {
                    return Promise.reject('alias cannot be longer than 15 characters')
                  }
                  return Promise.resolve()
                },
              },
            ]}
            extra={
              <>
                <span>format: &nbsp;&nbsp;&nbsp;&lt;ip&gt;/&lt;...domain&gt;/[alias]</span>
                <br />
                <span>example: 127.0.0.1/www.test.net/test-env</span>
              </>
            }
          >
            <Input ref={inputEl} placeholder="input your host, press enter to save" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default CreateHost
