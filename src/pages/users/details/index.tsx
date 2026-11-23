import { useParams } from 'react-router-dom';
import UserDetail from 'widgets/userDetail';

const UsersRetrieve = () => {
  const { id } = useParams();

  return <UserDetail userId={id ?? ''} />;
};

export default UsersRetrieve;
