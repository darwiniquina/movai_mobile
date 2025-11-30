import { PUBLIC_SEGMENTS } from "@/constants/routes";
import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";

type AuthErrors = {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
};

type AuthContextType = {
  user: string | null;
  errors: AuthErrors;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    username: string,
    display_name: null | string,
    bio: null | string,
    email: string,
    password: string,
    password_confirmation: string,
    emoji_avatar: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  errors: {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Load saved token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) setUser(token);
      setLoading(false);
    };
    loadUser();
  }, []);

  // Act like middleware: redirect based on auth and route
  useEffect(() => {
    if (loading) return;

    const inPublicGroup = PUBLIC_SEGMENTS.includes(segments[0]);

    if (!user && !inPublicGroup) {
      // not logged in and not on a public route
      router.replace("/login");
    } else if (user && ["login", "register"].includes(segments[0])) {
      // logged in but on login/register, redirect to home
      router.replace("/(tabs)");
    }
  }, [user, segments, loading]);

  const wrapAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  const handleApiErrors = (err: any) => {
    if (err.response?.data?.errors) {
      const fieldErrors: AuthErrors = {};
      for (const key in err.response.data.errors) {
        fieldErrors[key] = err.response.data.errors[key][0];
      }
      return fieldErrors;
    } else if (err.response?.data?.message) {
      return { general: err.response.data.message };
    } else {
      return { general: "Something went wrong" };
    }
  };

  const validateLogin = (
    email: string,
    password: string
  ): AuthErrors | null => {
    const errors: AuthErrors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    return Object.keys(errors).length ? errors : null;
  };

  const login = async (email: string, password: string) => {
    await wrapAsync(async () => {
      setErrors({});

      try {
        const validationErrors = validateLogin(email, password);
        if (validationErrors) {
          setErrors(validationErrors);
          return;
        }

        const { data } = await api.post("/login", { email, password });
        await SecureStore.setItemAsync("token", data.token);
        setUser(data.token);
      } catch (err: any) {
        setErrors(handleApiErrors(err));
      }
    });
  };

  const validateRegister = (
    name: string,
    username: string,
    display_name: null | string,
    bio: null | string,
    email: string,
    password: string,
    password_confirmation: string
  ): AuthErrors | null => {
    const errors: AuthErrors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!password_confirmation)
      errors.password_confirmation = "Password confirmation is required";
    if (!username) errors.username = "Username is required";
    if (!name) errors.name = "Name is required";
    if (password !== password_confirmation)
      errors.password_confirmation = "Passwords do not match";
    return Object.keys(errors).length ? errors : null;
  };

  const register = async (
    name: string,
    username: string,
    display_name: null | string,
    bio: null | string,
    email: string,
    password: string,
    password_confirmation: string,
    emoji_avatar: string
  ) => {
    await wrapAsync(async () => {
      setErrors({});

      try {
        const validationErrors = validateRegister(
          name,
          username,
          display_name,
          bio,
          email,
          password,
          password_confirmation
        );

        if (validationErrors) {
          setErrors(validationErrors);
          return;
        }

        await api.post("/register", {
          name,
          username,
          display_name,
          bio,
          email,
          password,
          password_confirmation,
          emoji_avatar,
        });

        router.replace("/register-success");
      } catch (err) {
        setErrors(handleApiErrors(err));
      }
    });
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, errors, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
