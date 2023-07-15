import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";

export default function PersistLogin() {
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyRefreshToken() {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setLoading(false);
  }, []);

  return <>{loading ? <p>Loading...</p> : <Outlet />}</>;
}
