import { showPopupInput } from '@/components';
import { changeHostWritable, isHostFileReadonly } from '@/native';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

function usePermissionModel() {
  const [canWriteHost, setCanWriteHost] = useState(false);

  const checkCanWriteHost = useCallback(async () => {
    const readOnly = await isHostFileReadonly();
    setCanWriteHost(!readOnly);
    return !readOnly;
  }, [setCanWriteHost]);

  useEffect(() => {
    checkCanWriteHost();
  }, [checkCanWriteHost]);

  const requestPermission = useCallback(async () => {
    const result = showPopupInput(
      'Please enter your password',
      'password',
      async (password) => {
        try {
          await changeHostWritable(password);
          setCanWriteHost(true);
          result.destroy();
        } catch (error: any) {
          message.error(error.message, 5);
        }
      },
      null,
    );
  }, [checkCanWriteHost, setCanWriteHost]);

  return {
    canWriteHost,
    requestPermission,
  };
}

export default usePermissionModel;
