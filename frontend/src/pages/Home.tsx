import { useEffect } from "react";
import { useAuth } from "../context/auth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

export default function Home() {
  const privateApi = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    fetchUser()
      .then((response) => {
        console.log("response home", response.data);
        setAuth((prev) => {
          return { ...prev, ...response.data };
        });
      })
      .catch(() => {
        navigate("/", { state: { from: location }, replace: true });
      });
  }, []);

  const fetchUser = async () => {
    return privateApi.get("/user/me", {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
  };

  return (
    <section>
      <h1>PRIVATE HOME</h1>
      <p>{auth.email}</p>
    </section>
  );
}
