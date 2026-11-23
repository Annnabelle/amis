import { Link } from 'react-router-dom';
import { routes } from "shared/config/routes";
import { useGetUserPreviewQuery } from 'entities/users/api';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

interface UserPreviewLinkProps {
  userId: string;
}

const UserPreviewLink = ({ userId }: UserPreviewLinkProps) => {
  const canReadUser = useCan(endpointAccessMap.usersRead);
  const canPreviewUser = useCan(endpointAccessMap.usersPreview);
  const { data: preview } = useGetUserPreviewQuery(
    { id: userId },
    { skip: !userId || !canPreviewUser }
  );

  const label = preview ? `${preview.firstName} ${preview.lastName}` : userId;

  return canReadUser ? (
    <Link to={routes.user(userId)} style={{ color: 'inherit' }}>
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
};

export default UserPreviewLink;
