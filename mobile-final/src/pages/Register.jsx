import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterContext } from "../context/RegisterContext";
import { accountSchema, profileSchema } from "../schemas/registerSchemas";
import debounce from "lodash.debounce";

const blockedUsernames = ["admin", "root", "superuser"];

function Step1({ onNext }) {
  const { data, updateAccount } = useContext(RegisterContext);
  const methods = useForm({
    resolver: zodResolver(accountSchema),
    mode: "onChange",
    defaultValues: data.account,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors,
    reset,
  } = methods;

  useEffect(() => {
    reset(data.account);
  }, [data.account, reset]);

  const usernameValue = watch("username");
  const [checking, setChecking] = useState(false);

  const validateUsername = useRef(
    debounce(async (value) => {
      if (!value || value.trim().length < 3) {
        setChecking(false);
        return;
      }

      setChecking(true);

      // simulate async call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const blocked = blockedUsernames.includes(value.toLowerCase());

      setChecking(false);

      if (blocked) {
        setError("username", {
          type: "manual",
          message: "ชื่อนี้มีคนใช้งานแล้ว",
        });
      } else {
        clearErrors("username");
      }
    }, 500)
  ).current;

  useEffect(() => {
    validateUsername(usernameValue);
  }, [usernameValue, validateUsername]);

  useEffect(() => {
    return () => {
      validateUsername.cancel();
    };
  }, [validateUsername]);

  const onSubmit = (values) => {
    if (checking) return;
    updateAccount(values);
    onNext();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded border px-3 py-2"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded border px-3 py-2"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              {...register("username")}
              className="w-full rounded border px-3 py-2"
              placeholder="ชื่อผู้ใช้"
            />
            {checking && (
              <p className="text-sm text-neutral-500">Checking...</p>
            )}
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={!isValid || checking}
              className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function Step2({ onNext, onBack }) {
  const { data, updateProfile } = useContext(RegisterContext);
  const methods = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: data.profile,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = methods;

  const occupation = watch("occupation");

  useEffect(() => {
    reset(data.profile);
  }, [data.profile, reset]);

  const onSubmit = (values) => {
    updateProfile(values);
    onNext();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Occupation</label>
            <select
              {...register("occupation")}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Select occupation</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="Other">Other</option>
            </select>
            {errors.occupation && (
              <p className="text-sm text-red-600">{errors.occupation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Company (optional)</label>
            <input
              type="text"
              {...register("company")}
              className="w-full rounded border px-3 py-2"
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              GitHub / Portfolio URL
            </label>
            <input
              type="text"
              {...register("github")}
              className="w-full rounded border px-3 py-2"
              placeholder="https://github.com/yourname"
              disabled={occupation !== "Developer"}
            />
            {errors.github && (
              <p className="text-sm text-red-600">{errors.github.message}</p>
            )}
            {occupation !== "Developer" && (
              <p className="text-sm text-neutral-500">
                (Only required when occupation is Developer)
              </p>
            )}
          </div>

          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded border px-4 py-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function Step3({ onBack }) {
  const { data, resetRegistration } = useContext(RegisterContext);
  const [submitted, setSubmitted] = useState(false);

  const flattened = useMemo(
    () => ({ ...data.account, ...data.profile }),
    [data]
  );

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review & Confirm</h2>
        <p className="text-sm text-gray-500">
          ตรวจสอบข้อมูลก่อนกดยืนยัน
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded border bg-white p-4 shadow-sm">
        {Object.entries(flattened).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-semibold capitalize">{key}</span>
            <span className="text-gray-700">{value || "-"}</span>
          </div>
        ))}
      </div>

      {submitted && (
        <div className="rounded border border-green-300 bg-green-50 p-4 text-green-800">
          Registration complete! (Simulated submission)
        </div>
      )}

      <div className="flex justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded border px-4 py-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Submit
        </button>
      </div>

      <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
        <p className="font-semibold">Tip</p>
        <p>
          หากกด Refresh ระหว่างขั้นตอน ข้อมูลยังคงอยู่ (เก็บใน
          localStorage) และจะกลับมาที่หน้าปัจจุบัน
        </p>
      </div>

      <button
        type="button"
        onClick={resetRegistration}
        className="text-sm text-red-600 hover:underline"
      >
        Start over (clear saved data)
      </button>
    </div>
  );
}

export default function Register() {
  const { data, setStep } = useContext(RegisterContext);

  const step = data.step;

  const goNext = () => setStep(step + 1);
  const goBack = () => setStep(Math.max(1, step - 1));

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold">Register</h1>

      <div className="mt-6 flex items-center gap-2 text-sm">
        <span className={step === 1 ? "font-semibold" : "text-gray-500"}>
          Step 1
        </span>
        <span className="text-gray-300">•</span>
        <span className={step === 2 ? "font-semibold" : "text-gray-500"}>
          Step 2
        </span>
        <span className="text-gray-300">•</span>
        <span className={step === 3 ? "font-semibold" : "text-gray-500"}>
          Step 3
        </span>
      </div>

      <div className="mt-8 rounded border bg-white p-6 shadow-sm">
        {step === 1 && <Step1 onNext={goNext} />}
        {step === 2 && <Step2 onNext={goNext} onBack={goBack} />}
        {step === 3 && <Step3 onBack={goBack} />}
      </div>
    </div>
  );
}
