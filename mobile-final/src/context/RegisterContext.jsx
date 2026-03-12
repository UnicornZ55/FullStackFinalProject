import { createContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "registrationData";

const defaultRegistration = {
  step: 1,
  account: {
    email: "",
    password: "",
    username: "",
  },
  profile: {
    occupation: "",
    company: "",
    github: "",
  },
};

export const RegisterContext = createContext();

export function RegisterProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore parse errors
    }
    return defaultRegistration;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const updateAccount = (account) => {
    setData((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        ...account,
      },
    }));
  };

  const updateProfile = (profile) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profile,
      },
    }));
  };

  const setStep = (step) => {
    setData((prev) => ({
      ...prev,
      step,
    }));
  };

  const resetRegistration = () => {
    setData(defaultRegistration);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      data,
      updateAccount,
      updateProfile,
      setStep,
      resetRegistration,
    }),
    [data]
  );

  return (
    <RegisterContext.Provider value={value}>
      {children}
    </RegisterContext.Provider>
  );
}
