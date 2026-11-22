import { DisconnectOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  StatusChangeConnectionStates,
  useStatusChangeConnection,
} from 'shared/lib/statusChangeConnection';

/**
 * Отметка о потерянном соединении с уведомлениями.
 *
 * Видна только в отключённом состоянии: пока всё работает, показывать нечего,
 * а вот молчащие уведомления выглядят как «ничего не происходит», и об этом
 * пользователь должен знать.
 */
const ConnectionBadge = () => {
  const { t } = useTranslation();
  const connection = useStatusChangeConnection();

  if (connection === StatusChangeConnectionStates.Online) return null;

  return (
    <Tooltip title={t('statusChange.offlineHint')}>
      <span className="connection-badge">
        <DisconnectOutlined />
        <span className="connection-badge-label">{t('statusChange.offline')}</span>
      </span>
    </Tooltip>
  );
};

export default ConnectionBadge;
