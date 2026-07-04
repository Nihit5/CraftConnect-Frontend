import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/Logo.png";
import headLogo from "../../assets/Head.png";
import { notify } from "../../utils/toast";

const inputClass =
  "h-10 w-full rounded-full border border-[#D8D1C9] bg-transparent px-4 text-sm text-[#2E1D17] outline-none placeholder:text-[#A59A90] focus:border-[#B56342] sm:h-11";

const REGISTER_API_URL = "/api/v1/user/register";

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const mobileNumber = String(formData.get("mobileNumber") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      notify.error("Password and Confirm Password must match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        firstName,
        lastName,
        email,
        mobileNumber,
        password,
        confirmPassword,
        role: "ROLE_USER",
      };

      const parseApiError = async (response) => {
        let apiMessage = `Signup failed (${response.status}). Please try again.`;
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
      };

      let response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let apiMessage = "";
      if (!response.ok) {
        apiMessage = await parseApiError(response);
        if (/cannot be blank/i.test(apiMessage)) {
          const formPayload = new URLSearchParams({
            firstName,
            lastName,
            email,
            mobileNumber,
            password,
            confirmPassword,
            role: "ROLE_USER",
          });
          response = await fetch(REGISTER_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: formPayload.toString(),
          });
        }
      }

      if (!response.ok) {
        apiMessage = await parseApiError(response);
        console.error("Signup API error", response.status, apiMessage);
        notify.error(apiMessage);
        return;
      }

      notify.success("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch {
      notify.error(
        "Unable to reach server. If backend is running, check CORS/proxy config."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-dvh w-full bg-[#f8f4ef]">
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

        <div className="flex items-start justify-center px-6 pb-6 pt-1 sm:px-8 sm:pt-3 md:pt-5">
          <div className="w-full max-w-[520px]">
            <div className="text-center">
              <img
                src={headLogo}
                alt="CraftConnect emblem"
                className="mx-auto mb-2 w-28 max-w-full sm:mb-3 sm:w-32"
              />
              <h1 className="font-serif text-3xl font-semibold text-[#2E1D17] sm:text-4xl">
                Join CraftConnect.
              </h1>
              <p className="mt-1 text-sm text-[#6E625A] sm:text-base">
                Create an account to discover, save and commission.
              </p>
            </div>

            <form
              className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2"
              onSubmit={handleSignup}
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block pl-2 text-sm font-medium text-[#3D342E] sm:text-base"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Ram"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block pl-2 text-sm font-medium text-[#3D342E] sm:text-base"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Lal"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block pl-2 text-sm font-medium text-[#3D342E] sm:text-base"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@craft.np"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="mb-2 block pl-2 text-sm font-medium text-[#3D342E] sm:text-base"
                >
                  Mobile number
                </label>
                <input
                  id="mobile"
                  name="mobileNumber"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block pl-2 text-sm font-medium text-[#3D342E] sm:text-base"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block pl-2 text-sm font-medium text-[#3D342E] sm:text-base"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div className="pt-1 sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-full bg-[#B95E39] text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:h-11"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-[#7A6F66]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#6A5A4D] transition-colors hover:text-[#2E1D17]"
              >
                Sign in
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

export default Signup;
