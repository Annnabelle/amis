import { useNavigate } from "react-router-dom";

export const useNavigationBack = () => {
  const navigate = useNavigate();
  return (path: string) => {
    navigate(path);
  };
};