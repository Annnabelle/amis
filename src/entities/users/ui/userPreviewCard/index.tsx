import { Popover, Skeleton, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getUserPreview } from 'entities/users/model';
import type { UserPreview } from 'entities/users/types';
import { useCan } from 'entities/access/lib';
import { Permissions } from 'entities/access/types';

const { Text } = Typography;

interface UserPreviewCardProps {
  user: UserPreview;
  compact?: boolean;
}

const statusColorMap: Record<string, string> = {
  active: 'green',
  inactive: 'gold',
  blocked: 'red',
};

const UserPreviewCard = ({ user, compact = false }: UserPreviewCardProps) => {
  const { t } = useTranslation();
  const canReadUser = useCan(Permissions.UsersRead, 'GLOBAL');
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || '-';
  const phoneDisplay = user.phone ? (user.phone.startsWith('+') ? user.phone : `+${user.phone}`) : '-';
  const iconChipStyle = {
    width: compact ? 24 : 24,
    height: compact ? 24 : 24,
    borderRadius: '50%',
    background: compact ? '#EEF4FF' : 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
  };
  const popoverContent = (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ ...iconChipStyle, width: 32, height: 32 }}>
          <UserOutlined style={{ color: '#5277FF', fontSize: 15 }} />
        </span>
        <div style={{ minWidth: 0 }}>
          <Text style={{ display: 'block', color: '#101828', fontSize: 14, fontWeight: 600 }} ellipsis={{ tooltip: fullName }}>
            {fullName}
          </Text>
          {user.status ? (
            <Tag
              color={statusColorMap[user.status] || 'default'}
              style={{
                margin: '3px 0 0',
                borderRadius: 999,
                fontSize: 11,
                lineHeight: '16px',
                padding: '0 7px',
              }}
            >
              {t(`statuses.${user.status}`, { defaultValue: user.status })}
            </Tag>
          ) : null}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <div>
          <Text style={{ display: 'block', color: '#8B95A5', fontSize: 12 }}>{t('common.email')}</Text>
          <Text style={{ color: '#1F2937', fontSize: 13 }} ellipsis={{ tooltip: user.email || '-' }}>
            {user.email || '-'}
          </Text>
        </div>
        <div>
          <Text style={{ display: 'block', color: '#8B95A5', fontSize: 12 }}>{t('common.phone')}</Text>
          <Text style={{ color: '#1F2937', fontSize: 13 }} ellipsis={{ tooltip: phoneDisplay }}>
            {phoneDisplay}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <Popover content={popoverContent} trigger="hover" placement="topLeft">
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: compact ? 9 : 10,
          width: compact ? 'fit-content' : undefined,
          maxWidth: compact ? '100%' : '100%',
          minWidth: compact ? 250 : 0,
          minHeight: compact ? 46 : undefined,
          padding: compact ? '7px 12px' : '6px 10px',
          border: compact ? '1px solid rgba(24, 144, 255, 0.12)' : '1px solid #E6EAF0',
          borderRadius: compact ? 18 : 8,
          background: '#FFFFFF',
          boxShadow: compact ? '0 8px 22px rgba(15, 23, 42, 0.06)' : undefined,
          color: '#1F2937',
          verticalAlign: 'middle',
          cursor: 'default',
        }}
      >
        <span style={iconChipStyle}>
          <UserOutlined style={{ color: '#5277FF', fontSize: compact ? 12 : 14 }} />
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          {canReadUser ? (
            <Link
              to={`/users/${user.id}`}
              style={{
                color: '#101828',
                fontWeight: compact ? 400 : 600,
                fontSize: 14,
                lineHeight: '17px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
                maxWidth: compact ? 300 : 180,
              }}
              title={fullName}
            >
              {fullName}
            </Link>
          ) : (
            <span
              style={{
              color: '#101828',
              fontWeight: compact ? 400 : 600,
              fontSize: 14,
              lineHeight: '17px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
              maxWidth: compact ? 300 : 180,
              }}
              title={fullName}
            >
              {fullName}
            </span>
          )}

          {user.email ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0, color: '#4B5B73' }}>
              <Text
                style={{
                  maxWidth: compact ? 300 : 190,
                  color: 'inherit',
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: '16px',
                }}
                ellipsis={{ tooltip: user.email }}
              >
                {user.email}
              </Text>
            </span>
          ) : null}
        </div>
      </div>
    </Popover>
  );
};

export const UserPreviewCardById = ({ userId, compact = false }: { userId: string; compact?: boolean }) => {
  const dispatch = useAppDispatch();
  const preview = useAppSelector((state) => state.users.userPreviewById[userId]);
  const canPreviewUser = useCan(Permissions.UsersPreview, 'ANY');

  useEffect(() => {
    if (!userId || preview || !canPreviewUser) {
      return;
    }

    void dispatch(getUserPreview({ id: userId }));
  }, [canPreviewUser, dispatch, preview, userId]);

  if (!userId) {
    return null;
  }

  if (!canPreviewUser) {
    return <span>{userId}</span>;
  }

  if (!preview) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          width: compact ? '100%' : 220,
          maxWidth: '100%',
          height: compact ? 46 : 32,
          verticalAlign: 'middle',
        }}
      >
        <Skeleton.Input active size="small" style={{ width: '100%', minWidth: 0 }} />
      </span>
    );
  }

  return <UserPreviewCard user={preview} compact={compact} />;
};

export default UserPreviewCard;
