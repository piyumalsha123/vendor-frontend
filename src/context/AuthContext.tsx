import { createContext, useEffect, useState } from "react";
import { getMyDetails } from "../service/auth";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    
    if (token) {
      setLoading(true);
      getMyDetails()
        .then((res) => {
          if (res?.data) {
            const userData = res.data;

          
            // if (userData.role && !userData.roles) {
            //   userData.roles = [userData.role];
            // } else if (!userData.roles) {
            //   userData.roles = []; 
            // }

            setUser(userData);
          } else {
            setUser(null);
          }
        })
        .catch((err) => {
          console.error("Auth Error:", err);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};