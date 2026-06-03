import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

interface FormValues {
  email: string;
  password: string;
  fullName?: string;
  displayName?: string;
  age?: number | null;
};

interface AuthFormProps {
  mode: "signIn" | "signUp";
};

const getAuthErrorMessage = (err: unknown, isSignUp: boolean) => {
  if (err instanceof FirebaseError && err.code === "permission-denied") {
    return "Account was created, but the profile could not be saved. Please check Firestore permissions.";
  }

  return isSignUp
    ? "Something went wrong while creating your account."
    : "Something went wrong. Please check your credentials.";
};

const AuthForm: FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const isSignUp = mode === "signUp";

  const getSchema = (isSignUp: boolean): yup.ObjectSchema<FormValues> => {
    return yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),

      fullName: isSignUp
        ? yup.string().required("full name is a required field")
        : yup.string().optional(),

      displayName: isSignUp
        ? yup.string().required("display name is a required field")
        : yup.string().optional(),

      age: isSignUp
        ? yup.number().typeError("age must be a number").nullable().optional()
        : yup.number().nullable().optional(),
    });
  };

  const schema = useMemo(() => getSchema(isSignUp), [isSignUp]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setAuthError(null);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );

        await updateProfile(userCredential.user, {
          displayName: data.displayName,
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: data.email,
          fullName: data.fullName,
          displayName: data.displayName,
          age: data.age ?? null,
          favorites: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setAuthError(getAuthErrorMessage(err, isSignUp));
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          fullName: userCredential.user.displayName,
          displayName: userCredential.user.displayName,
          age: null,
          favorites: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setAuthError(getAuthErrorMessage(err, false));
    }
  };

  return (
    <>
      <form
        className="flex flex-col items-center gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isSignUp && (
          <>
            <div className="flex flex-col gap-1 w-full items-center">
              <input
                className="w-full border p-2"
                placeholder="Full Name"
                {...register("fullName")}
              />
              <p className="text-error!">{errors.fullName?.message}</p>
            </div>

            <div className="flex flex-col gap-1 w-full items-center">
              <input
                className="w-full border p-2"
                placeholder="Display Name"
                {...register("displayName")}
              />
              <p className="text-error!">{errors.displayName?.message}</p>
            </div>
          </>
        )}

        <div className="flex flex-col gap-1 w-full items-center">
          <input
            className="w-full border p-2"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          <p className="text-error!">{errors.email?.message}</p>
        </div>

        <div className="flex flex-col gap-1 w-full items-center">
          <input
            className="w-full border p-2"
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <p className="text-error!">{errors.password?.message}</p>
        </div>

        {isSignUp && (
          <div className="flex flex-col gap-1 w-full items-center">
            <input
              className="w-full border p-2"
              type="number"
              placeholder="Age"
              {...register("age")}
            />
            <p className="text-error!">{errors.age?.message}</p>
          </div>
        )}

        {authError && <p className="text-error! text-center">{authError}</p>}

        {
          <button className="w-max border p-2" type="submit">
            {isSignUp ? "Create Account" : "Sign in with Email"}
          </button>
        }
      </form>
      {!isSignUp && (
        <>
          <p className="text-center mt-5">
            Don't have an account?{" "}
            <Link className="underline" to="/signup">
              Sign up
            </Link>
          </p>
          <hr className="my-5" />
          <div className="flex justify-center">
            <button
              className="w-max border p-2 mx-auto"
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default AuthForm;
