import { useEffect, useState } from "react";
import { getProfile, User } from "../api/auth";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getProfile()
      .then((data) => setUser(data.user))
      .catch(() => alert("Unauthorized! Please log in."));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {user ? (
        <p>Welcome, <b>{user.username}</b>!</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
