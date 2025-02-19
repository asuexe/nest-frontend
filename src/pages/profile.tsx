import { useEffect, useState } from "react";
import { getProfile, User } from "../api/auth";
import GujaratMap from "../components/map";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true); // Track auth state

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        setIsAuthorized(true); // Allow map when user is valid
      })
      .catch(() => {
        setIsAuthorized(false); // Hide map on invalid login
        alert("Unauthorized! Please log in.");
      });
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {/* Conditionally render the map */}
      {isAuthorized && (
        <div className="absolute inset-0">
          <GujaratMap />
        </div>
      )}

      {/* Centered Profile Box */}
      <div className="relative z-10 max-w-md mx-auto mt-10 p-4 border rounded bg-white shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Profile</h2>
        <div className="flex items-center justify-center space-x-2">
          {user ? (
            <>
              <span>Welcome,</span>
              <b>{user.username}</b>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
