import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getUserPreview } from 'entities/users/model';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

interface UserPreviewLinkProps {
  userId: string;
}

const UserPreviewLink = ({ userId }: UserPreviewLinkProps) => {
  const dispatch = useAppDispatch();
  const preview = useAppSelector((state) => state.users.userPreviewById[userId]);
  const canReadUser = useCan(endpointAccessMap.usersRead);
  const canPreviewUser = useCan(endpointAccessMap.usersPreview);

  useEffect(() => {
    if (!userId || !canPreviewUser) {
      return;
    }

    if (!preview) {
      void dispatch(getUserPreview({ id: userId }));
    }
  }, [canPreviewUser, dispatch, preview, userId]);

  const label = preview ? `${preview.firstName} ${preview.lastName}` : userId;

  return canReadUser ? (
    <Link to={`/users/${userId}`} style={{ color: 'inherit' }}>
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
};

export default UserPreviewLink;
