import { useEffect } from 'react'

import { destoryGlobalSpinner } from '@/helpers/view'

export default ({ children }) => {
  useEffect(() => {
    destoryGlobalSpinner()
  }, [])

  return children
}
