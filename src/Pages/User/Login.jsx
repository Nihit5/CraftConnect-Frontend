import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/Logo.png";
import headLogo from "../../assets/Head.png";
import { useAuth, fetchUserInit } from "../../context/AuthContext";
import { notify } from "../../utils/toast";

const LOGIN_API_URL = "/api/v1/user/login";

const VENDOR_STATUS_MESSAGES = {
  PENDING:
    "Your request is currently pending. Please contact our team for an update regarding its status.",
  REJECTED:
    "Your request has been rejected. Please contact our team for further details.",
  SUSPENDED:
    "Your account has been suspended. Please contact our support team for further information and assistance.",
};

const inputClass =
  "h-10 w-full rounded-full border border-[#D8D1C9] bg-transparent px-4 text-sm text-[#2E1D17] outline-none placeholder:text-[#A59A90] focus:border-[#B56342] sm:h-11";

async function parseApiError(response, fallback) {
  let apiMessage = fallback;
  try {
    const rawBody = await response.text();
    if (!rawBody) return apiMessage;
    try {
      const data = JSON.parse(rawBody);
      if (data?.message) return data.message;
      if (data?.error) return data.error;
      if (data?.errors && Object.keys(data.errors).length > 0) {
        const [firstKey] = Object.keys(data.errors);
        const firstValue = data.errors[firstKey];
        return Array.isArray(firstValue)
          ? `${firstKey}: ${firstValue[0]}`
          : `${firstKey}: ${firstValue}`;
      }
    } catch {
      return rawBody;
    }
  } catch {
    // keep fallback message
  }
  return apiMessage;
}

function extractToken(data) {
  return (
    data?.token ??
    data?.accessToken ??
    data?.jwt ??
    data?.data?.token ??
    data?.data?.accessToken ??
    null
  );
}

function StatusModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vendor-status-title"
        className="w-full max-w-md rounded-2xl border border-[#E8DFD6] bg-[#FDF9F5] p-6 shadow-xl"
      >
        <h2
          id="vendor-status-title"
          className="font-serif text-xl font-semibold text-[#2E1D17]"
        >
          Account Status
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6E625A]">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-10 w-full rounded-full bg-[#B95E39] text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          OK
        </button>
      </div>
    </div>
  );
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalMessage, setStatusModalMessage] = useState(null);

  const handlePostLogin = async (token, initResponse) => {
    const role = initResponse?.role;

    if (role === "ROLE_USER") {
      await login(token, initResponse);
      notify.success("Welcome back!");
      navigate("/", { replace: true });
      return;
    }

    if (role === "ROLE_VENDOR") {
      const vendorStatus = String(initResponse?.status ?? "").toUpperCase();

      if (vendorStatus === "APPROVED") {
        await login(token, initResponse);
        notify.success("Welcome back!");
        navigate("/vendor", { replace: true });
        return;
      }

      const message = VENDOR_STATUS_MESSAGES[vendorStatus];
      if (message) {
        setStatusModalMessage(message);
        return;
      }

      notify.error("Unable to verify your vendor account status.");
      return;
    }

    if (role === "ROLE_ADMIN") {
      await login(token, initResponse);
      notify.success("Welcome back!");
      navigate("/admin", { replace: true });
      return;
    }

    notify.error("Unrecognized account role. Please contact support.");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      notify.error("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      let response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const apiMessage = await parseApiError(
          response,
          `Login failed (${response.status}). Please try again.`,
        );

        if (/cannot be blank/i.test(apiMessage)) {
          const formPayload = new URLSearchParams({ email, password });
          response = await fetch(LOGIN_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: formPayload.toString(),
          });
        } else {
          notify.error(apiMessage);
          return;
        }
      }

      if (!response.ok) {
        notify.error(
          await parseApiError(
            response,
            `Login failed (${response.status}). Please try again.`,
          ),
        );
        return;
      }

      const rawBody = await response.text();
      let data = {};
      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          data = { token: rawBody };
        }
      }

      const token = extractToken(data);
      if (!token) {
        notify.error("Login succeeded but no token was returned.");
        return;
      }

      const initResponse = await fetchUserInit(token);
      await handlePostLogin(token, initResponse);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Init failed")) {
        notify.error("Login succeeded but failed to load your profile.");
      } else {
        notify.error(
          "Unable to reach server. If backend is running, check CORS/proxy config.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-dvh w-full bg-[#f8f4ef]">
      {statusModalMessage && (
        <StatusModal
          message={statusModalMessage}
          onClose={() => setStatusModalMessage(null)}
        />
      )}

      <div className="grid min-h-dvh w-full grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[380px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=1400&q=80"
            alt="Pottery craft"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />

          <Link
            to="/"
            className="absolute left-7 top-2 flex items-center gap-2 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-3"
          >
            <img
              src={logoImage}
              alt="CraftConnect logo"
              className="h-7 w-7 scale-[1.6] rounded-full object-cover sm:h-8 sm:w-8"
            />
            <span className="font-serif text-2xl font-semibold text-[#1A1A1A]">
              CraftConnect
            </span>
          </Link>

          <div className="absolute bottom-6 left-7 right-7 text-white sm:bottom-8 sm:left-10">
            <h2 className="max-w-[420px] font-serif text-2xl font-semibold leading-tight sm:text-3xl">
              Every piece, signed by hand.
            </h2>
            <p className="mt-2 max-w-[460px] text-xs leading-6 text-white/90 sm:text-sm">
              Join a community shaping clay, weaving wool and forging silver -
              keeping craft alive.
            </p>
          </div>
        </div>

        <div className="flex items-start justify-center px-6 pb-6 pt-4 sm:px-8 sm:pt-6 md:pt-8">
          <div className="w-full max-w-[430px]">
            <div className="text-center">
              <img
                src={headLogo}
                alt="CraftConnect emblem"
                className="mx-auto mb-3 w-28 max-w-full sm:mb-4 sm:w-32"
              />
              <h1 className="font-serif text-3xl font-semibold text-[#2E1D17] sm:text-4xl">
                Welcome back.
              </h1>
              <p className="mt-1 text-sm text-[#6E625A] sm:text-base">
                Sign in to continue your craft journey.
              </p>
            </div>

            <form className="mt-6 space-y-4 sm:mt-7" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#3D342E] sm:text-base"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@craft.np"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#3D342E] sm:text-base"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[#8E8075] transition-colors hover:text-[#4D4138] sm:text-sm"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full rounded-full bg-[#B95E39] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:h-11"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#7A6F66]">
              New here?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#6A5A4D] transition-colors hover:text-[#2E1D17]"
              >
                Create an account
              </Link>
            </p>
            <p className="mt-3 text-center text-sm text-[#7A6F66]">
              Want to join as Vendor?{" "}
              <Link
                to="/vendor/signup"
                className="font-semibold text-[#6A5A4D] transition-colors hover:text-[#2E1D17]"
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
