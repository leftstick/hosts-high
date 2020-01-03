import { useState } from 'react'
import { Input, Form } from 'antd'
import PropTypes from 'prop-types'

import { useClickAway } from '@umijs/hooks'

import { isIp, isDomains } from '@/helpers/object'
import usePermissionModel from '@/hooks/usePermissionModel'
import useHostsModel from '@/hooks/useHostsModel'

import styles from '@/pages/index/components/EditableCell/index.less'

const EditArea = Form.create()(RawEditArea)

function EditableCell({ record, property }) {
  const { acquired } = usePermissionModel()
  const [editing, setEditing] = useState(false)
  const { modifyHost } = useHostsModel()
  const ref = useClickAway(() => {
    setEditing(false)
  })

  if (!editing) {
    return (
      <div
        style={{ height: '21px', width: '100%' }}
        onDoubleClick={() => {
          acquired && setEditing(true)
        }}
      >
        {record[property]}
      </div>
    )
  }

  return (
    <div ref={ref}>
      <EditArea
        record={record}
        property={property}
        onChange={val => {
          setEditing(false)
          modifyHost(record, {
            ...record,
            [property]: val
          })
        }}
      />
    </div>
  )
}

EditableCell.propTypes = {
  record: PropTypes.object,
  property: PropTypes.string
}

export default EditableCell

function RawEditArea({ form, property, record, onChange }) {
  const { getFieldDecorator, validateFields } = form

  function modify(e) {
    e.preventDefault()

    validateFields((err, values) => {
      if (err) {
        return
      }
      onChange && onChange(values.host)
    })
  }

  return (
    <Form className={styles.editArea} onSubmit={modify}>
      <Form.Item>
        {getFieldDecorator('host', {
          initialValue: record[property],
          rules: [
            {
              validator(rule, value, callback) {
                if (['ip', 'domain'].includes(property) && !value) {
                  return callback(`${property} is required`)
                }
                if ('ip' === property && !isIp(value)) {
                  return callback('incorrect ip format')
                }
                if ('domain' === property && !isDomains(value)) {
                  return callback('incorrect domains format')
                }
                if ('alias' === property && value.length > 15) {
                  return callback('alias cannot be longer than 15 characters')
                }
                callback()
              }
            }
          ]
        })(<Input autoFocus style={{ height: '26px' }} />)}
      </Form.Item>
    </Form>
  )
}

RawEditArea.propTypes = {
  form: PropTypes.object,
  record: PropTypes.object,
  property: PropTypes.string,
  onChange: PropTypes.func
}
