import AuthForm from "@/components/AuthForm";

const SignIn = () => {
  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2 className="text-center mb-10">Sign In</h2>
      <AuthForm mode="signIn" />
    </div>
  );
};

export default SignIn;
