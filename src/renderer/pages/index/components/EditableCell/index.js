import { useState } from 'react'
import { Input, Form } from 'antd'
import PropTypes from 'prop-types'

import { useModel } from 'umi'
import { useClickAway } from '@umijs/hooks'

import { isIp, isDomains } from '@/helpers/object'

import styles from './index.less'

function EditableCell({ record, property }) {
  const [editing, setEditing] = useState(false)
  const { acquired } = useModel('usePermissionModel')
  const { modifyHost } = useModel('useHostsModel')
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

function EditArea({ property, record, onChange }) {
  function modify(values) {
    onChange && onChange(values.host)
  }

  return (
    <Form
      className={styles.editArea}
      onFinish={modify}
      initialValues={{
        host: record[property]
      }}
    >
      <Form.Item
        name="host"
        rules={[
          {
            validator(rule, value) {
              if (['ip', 'domain'].includes(property) && !value) {
                return Promise.reject(`${property} is required`)
              }
              if ('ip' === property && !isIp(value)) {
                return Promise.reject('incorrect ip format')
              }
              if ('domain' === property && !isDomains(value)) {
                return Promise.reject('incorrect domains format')
              }
              if ('alias' === property && value.length > 15) {
                return Promise.reject('alias cannot be longer than 15 characters')
              }
              return Promise.resolve()
            }
          }
        ]}
      >
        <Input autoFocus style={{ height: '26px' }} />
      </Form.Item>
    </Form>
  )
}

EditArea.propTypes = {
  form: PropTypes.object,
  record: PropTypes.object,
  property: PropTypes.string,
  onChange: PropTypes.func
}
