import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../core/auth";
import { User, database, getUser } from "../core/database";
import { doc, onSnapshot } from "firebase/firestore";

type AuthContextProps = {
  user: User | null;
  logOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const userSave = localStorage.getItem("userSave") || "";
  const [user, setUser] = useState<User | null>(
    userSave && JSON.parse(userSave),
  );

  useEffect(() => {
    auth.onAuthStateChanged(async (u) => {
      if (!u) return setUser(null);

      const dbUser = await getUser(u.uid);

      onSnapshot(doc(database, "users", u.uid), (doc) => {
        setUser({ id: u.uid, ...doc.data() } as User);
        localStorage.setItem(
          "userSave",
          JSON.stringify({ id: u.uid, ...doc.data() } as User),
        );
      });

      localStorage.setItem("userSave", JSON.stringify(dbUser));
      setUser(dbUser);
    });
  }, []);

  const logOut = async () => {
    await auth.signOut();
    localStorage.removeItem("userSave");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
