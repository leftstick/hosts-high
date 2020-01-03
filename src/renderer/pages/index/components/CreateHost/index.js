import { useState, useRef } from 'react'
import { Button, Drawer, Form, Input, Tooltip } from 'antd'
import PropTypes from 'prop-types'

import { isIp, isDomains } from '@/helpers/object'
import usePermissionModel from '@/hooks/usePermissionModel'
import useHostsModel from '@/hooks/useHostsModel'

function CreateHost({ form }) {
  const inputEl = useRef(null)
  const [drawerVisable, setDrawerVisable] = useState(false)
  const { acquired } = usePermissionModel()
  const { createHost } = useHostsModel()

  const { getFieldDecorator, validateFields, resetFields } = form

  if (!acquired) {
    return (
      <Tooltip placement="left" title="Please acquire permission first">
        <Button disabled>Create</Button>
      </Tooltip>
    )
  }

  function saveHost(e) {
    e.preventDefault()

    validateFields((err, values) => {
      if (err) {
        return
      }
      const vals = values.host.split('/')
      const host = {
        ip: vals[0],
        domain: vals[1],
        alias: vals[2] && vals[2].trim(),
        disabled: false
      }
      createHost(host).then(() => {
        resetFields()
        setDrawerVisable(false)
      })
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
        afterVisibleChange={vis => {
          vis && inputEl.current.focus()
        }}
      >
        <Form onSubmit={saveHost}>
          <Form.Item
            extra={
              <>
                <span>format: &nbsp;&nbsp;&nbsp;&lt;ip&gt;/&lt;...domain&gt;/[alias]</span>
                <br />
                <span>example: 127.0.0.1/www.test.net/test-env</span>
              </>
            }
          >
            {getFieldDecorator('host', {
              rules: [
                {
                  required: true,
                  message: 'Please input your host!'
                },
                {
                  validator(rule, value, callback) {
                    const vals = value.split('/')
                    if (vals.length < 2 || vals.length > 3) {
                      return callback(`incorrect format: '/' should be delimiter, and separated into [2,3] pieces`)
                    }
                    if (!vals[0]) {
                      return callback('ip must be specified')
                    }
                    if (!vals[1]) {
                      return callback('domain must be specified')
                    }
                    if (!isIp(vals[0])) {
                      return callback('incorrect ip format')
                    }
                    if (!isDomains(vals[1])) {
                      return callback('incorrect domain format, multiple domains can be separated via space')
                    }
                    if (vals[2] && vals[2].length > 15) {
                      return callback('alias cannot be longer than 15 characters')
                    }
                    callback()
                  }
                }
              ]
            })(<Input ref={inputEl} placeholder="input your host" />)}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

CreateHost.propTypes = {
  form: PropTypes.object
}

export default Form.create()(CreateHost)
