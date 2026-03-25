import AuthForm from "@/components/AuthForm";

const SignUp = () => {
  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2 className="text-center mb-10">Sign Up</h2>
      <AuthForm mode="signUp" />
    </div>
  );
};

export default SignUp;
