import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getUserPreview } from 'entities/users/model';

interface UserPreviewLinkProps {
  userId: string;
}

const UserPreviewLink = ({ userId }: UserPreviewLinkProps) => {
  const dispatch = useAppDispatch();
  const preview = useAppSelector((state) => state.users.userPreviewById[userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!preview) {
      void dispatch(getUserPreview({ id: userId }));
    }
  }, [dispatch, preview, userId]);

  return (
    <Link to={`/users/${userId}`} style={{ color: 'inherit' }}>
      {preview ? `${preview.firstName} ${preview.lastName}` : userId}
    </Link>
  );
};

export default UserPreviewLink;
