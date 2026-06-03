import { useAuth } from "@/hooks/useAuth";

const UserPage = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>User Profile</h1>

      <div className="flex flex-col gap-4 rounded-2xl border border-border-default p-6">
        <p>
          <span className="text-text-secondary">Full name: </span>
          {user.fullName || "Not provided"}
        </p>
        <p>
          <span className="text-text-secondary">Display name: </span>
          {user.displayName || "Not provided"}
        </p>
        <p>
          <span className="text-text-secondary">Email: </span>
          {user.email || "Not provided"}
        </p>
        <p>
          <span className="text-text-secondary">Age: </span>
          {user.age ?? "Not provided"}
        </p>
      </div>
    </div>
  );
};

export default UserPage;
