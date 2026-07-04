import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/Logo.png";
import homeBackground from "../../assets/HomeBackground.png";
import { notify } from "../../utils/toast";

const REGISTER_API_URL = "/api/v1/user/register";
const PROVINCE_API_URL = "/api/v1/location/province";
const DISTRICT_API_URL = "/api/v1/location/district";

const STEPS = [
  { id: 1, label: "Business Details", icon: "briefcase" },
  { id: 2, label: "Location", icon: "location" },
  { id: 3, label: "Legal Documents", icon: "document" },
];

const inputClass =
  "box-border h-11 w-full rounded-xl border border-[#E0D5CC] bg-white px-4 text-sm leading-normal text-[#2E1D17] outline-none placeholder:text-[#A59A90] focus:border-[#B25B3E]";

const selectClass =
  "box-border block h-11 w-full min-h-11 max-h-11 appearance-none rounded-xl border border-[#E0D5CC] bg-white bg-[length:16px] bg-[position:right_12px_center] bg-no-repeat px-4 pr-10 text-sm leading-normal text-[#2E1D17] outline-none focus:border-[#B25B3E] disabled:cursor-not-allowed disabled:bg-[#FAF7F3] disabled:text-[#9A9189] [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%236B6560%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27m6%209%206%206%206-6%27/%3E%3C/svg%3E')]";

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
    // keep fallback
  }
  return apiMessage;
}

function StepIcon({ type, active, completed }) {
  const color = active || completed ? "#B25B3E" : "#C4BAB0";
  const bg = active || completed ? "#F5EDE4" : "#F8F4EF";

  const icons = {
    briefcase: <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 9h16v10H4z" />,
    location: (
      <>
        <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    document: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </>
    ),
  };

  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors sm:h-10 sm:w-10"
      style={{ borderColor: color, backgroundColor: bg }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {icons[type]}
      </svg>
    </div>
  );
}

function FileUploadField({
  label,
  required,
  file,
  onChange,
  accept = "image/jpeg,image/png,application/pdf",
  hint = "PDF, JPG, PNG (Max 5MB)",
}) {
  const inputRef = useRef(null);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
        {label}
        {required && <span className="text-[#B25B3E]"> *</span>}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D8D1C9] bg-[#FAF7F3] px-4 py-3.5 text-sm text-[#6B6560] transition-colors hover:border-[#B25B3E] hover:text-[#B25B3E]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        {file ? file.name : "Choose File"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#4A7C59]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {file.name}
        </p>
      )}
      <p className="mt-1 text-xs text-[#9A9189]">{hint}</p>
    </div>
  );
}

function SuccessView({ onReset }) {
  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden px-6">
      <img
        src={homeBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#FDF9F5]/80 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-[0_8px_32px_rgba(46,29,23,0.12)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EDE4]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B25B3E"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-[#2E1D17]">
          Registration Submitted!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6B6560]">
          Thank you for joining CraftConnect. Our team will review your
          application and get back to you within 2–3 business days.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#B25B3E] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Go to Home
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-full border border-[#E0D5CC] bg-white px-6 py-2.5 text-sm font-medium text-[#2E1D17] transition-colors hover:border-[#B25B3E] hover:text-[#B25B3E]"
          >
            Submit Another Registration
          </button>
        </div>
      </div>
    </div>
  );
}

const initialForm = {
  ownerName: "",
  businessName: "",
  email: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
  provinceId: "",
  provinceName: "",
  districtId: "",
  districtName: "",
  address: "",
  agreedToTerms: false,
};

const VendorSignup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [citizenshipFront, setCitizenshipFront] = useState(null);
  const [citizenshipBack, setCitizenshipBack] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const logoInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetch(PROVINCE_API_URL)
      .then((res) => res.json())
      .then((json) => setProvinces(json?.data ?? []))
      .catch(() => notify.error("Unable to load provinces."))
      .finally(() => setLoadingProvinces(false));
  }, []);

  useEffect(() => {
    if (!form.provinceId) {
      setDistricts([]);
      return;
    }

    setLoadingDistricts(true);
    fetch(`${DISTRICT_API_URL}/${form.provinceId}`)
      .then((res) => res.json())
      .then((json) => setDistricts(json?.data ?? []))
      .catch(() => notify.error("Unable to load districts."))
      .finally(() => setLoadingDistricts(false));
  }, [form.provinceId]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (file) => {
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!logoFile) return "Business logo is required.";
      if (!form.ownerName.trim()) return "Owner name is required.";
      if (!form.businessName.trim()) return "Business name is required.";
      if (!form.email.trim()) return "Business email is required.";
      if (!form.mobileNumber.trim()) return "Phone number is required.";
      if (!form.password) return "Password is required.";
      if (form.password !== form.confirmPassword) {
        return "Password and Confirm Password must match.";
      }
    }
    if (currentStep === 2) {
      if (!form.provinceId) return "Province is required.";
      if (!form.districtId) return "District is required.";
      if (!form.address.trim()) return "Address is required.";
    }
    if (currentStep === 3) {
      if (!citizenshipFront) return "Citizenship front image is required.";
      if (!citizenshipBack) return "Citizenship back image is required.";
      if (!panCard) return "PAN registration document is required.";
      if (!form.agreedToTerms)
        return "Please agree to the terms and conditions.";
    }
    return "";
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      notify.error(error);
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handlePrevious = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    const error = validateStep(3);
    if (error) {
      notify.error(error);
      return;
    }

    setIsSubmitting(true);

    try {
      const ownerName = form.ownerName.trim();
      const payload = new FormData();
      payload.append("firstName", ownerName);
      payload.append("lastName", ownerName);
      payload.append("email", form.email.trim());
      payload.append("mobileNumber", form.mobileNumber.trim());
      payload.append("password", form.password);
      payload.append("confirmPassword", form.confirmPassword);
      payload.append("role", "ROLE_VENDOR");
      payload.append("businessName", form.businessName.trim());
      payload.append("province", form.provinceName);
      payload.append("district", form.districtName);
      payload.append("address", form.address.trim());
      payload.append("displayPicture", logoFile);
      payload.append("citizenshipFrontImage", citizenshipFront);
      payload.append("citizenshipBackImage", citizenshipBack);
      payload.append("panCardImage", panCard);

      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        notify.error(
          await parseApiError(
            response,
            `Registration failed (${response.status}). Please try again.`,
          ),
        );
        return;
      }

      notify.success("Registration submitted successfully!");
      setIsSuccess(true);
    } catch {
      notify.error(
        "Unable to reach server. If backend is running, check CORS/proxy config.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setLogoFile(null);
    setLogoPreview(null);
    setCitizenshipFront(null);
    setCitizenshipBack(null);
    setPanCard(null);
    setStep(1);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return <SuccessView onReset={handleReset} />;
  }

  const stepTitle =
    step === 1
      ? "Business Details"
      : step === 2
        ? "Location"
        : "Legal Documents";

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <img
        src={homeBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#FDF9F5]/75 backdrop-blur-[1px]" />

      <div className="relative flex h-full flex-col overflow-hidden px-4 pt-1 pb-2 sm:px-6">
        <Link
          to="/"
          className="mb-1 inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#E0D5CC] bg-white/95 px-3 py-1.5 text-sm font-medium text-[#2E1D17] shadow-sm transition-colors hover:border-[#B25B3E] hover:text-[#B25B3E] sm:px-4 sm:py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>

        <div className="mx-auto flex w-full max-w-5xl flex-1 min-h-0 flex-col justify-start overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(46,29,23,0.12)]">
            <div className="shrink-0 bg-gradient-to-r from-[#B25B3E] via-[#C4714A] to-[#D4956A] px-6 py-4 text-center sm:px-10">
              <div className="mb-1.5 flex items-center justify-center gap-2">
                <img
                  src={logoImage}
                  alt=""
                  className="h-8 w-8 scale-[1.6] rounded-full object-cover"
                />
                <span className="font-serif text-xl font-bold text-white">
                  CraftConnect
                </span>
              </div>
              <h1 className="font-serif text-2xl font-semibold text-white sm:text-[28px]">
                Join Our Artisan Network
              </h1>
              <p className="mt-1.5 text-sm text-white/90">
                Register your craft business and reach customers across Nepal
              </p>
            </div>

            <div className="shrink-0 border-b border-[#F0E6DA] px-4 py-3 sm:px-8">
              <div className="flex items-start justify-between gap-1">
                {STEPS.map((item, index) => {
                  const isActive = step === item.id;
                  const isCompleted = step > item.id;
                  return (
                    <div
                      key={item.id}
                      className="flex flex-1 flex-col items-center"
                    >
                      <div className="flex w-full items-center">
                        {index > 0 && (
                          <div
                            className={`h-0.5 flex-1 ${isCompleted || isActive ? "bg-[#B25B3E]" : "bg-[#E8E0D8]"}`}
                          />
                        )}
                        <StepIcon
                          type={item.icon}
                          active={isActive}
                          completed={isCompleted}
                        />
                        {index < STEPS.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 ${isCompleted ? "bg-[#B25B3E]" : "bg-[#E8E0D8]"}`}
                          />
                        )}
                      </div>
                      <p
                        className={`mt-1.5 hidden text-center text-xs font-medium sm:block ${isActive ? "text-[#B25B3E]" : "text-[#9A9189]"}`}
                      >
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3 sm:px-8 sm:py-4">
              {step === 1 && (
                <div className="mb-2 flex shrink-0 flex-col items-center">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-dashed border-[#D8D1C9] bg-[#FAF7F3] transition-colors hover:border-[#B25B3E] sm:h-16 sm:w-16"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Business logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[10px] text-[#9A9189]">
                        Logo
                      </span>
                    )}
                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#B25B3E] text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={11}
                        height={11}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </span>
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleLogoChange(e.target.files?.[0] ?? null)
                    }
                  />
                  <p className="mt-1 text-xs font-medium text-[#3D342E]">
                    Business Logo <span className="text-[#B25B3E]">*</span>
                  </p>
                </div>
              )}

              <h2 className="mb-3 shrink-0 text-center font-serif text-xl font-semibold text-[#2E1D17] sm:text-2xl">
                {stepTitle}
              </h2>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {step === 1 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
                        Owner Name <span className="text-[#B25B3E]">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.ownerName}
                        onChange={(e) =>
                          updateField("ownerName", e.target.value)
                        }
                        placeholder="Full name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
                        Business Name <span className="text-[#B25B3E]">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.businessName}
                        onChange={(e) =>
                          updateField("businessName", e.target.value)
                        }
                        placeholder="Your craft business"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
                        Business Email <span className="text-[#B25B3E]">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@craft.np"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
                        Phone Number <span className="text-[#B25B3E]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.mobileNumber}
                        onChange={(e) =>
                          updateField("mobileNumber", e.target.value)
                        }
                        placeholder="98XXXXXXXX"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
                        Password <span className="text-[#B25B3E]">*</span>
                      </label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
                        Confirm Password{" "}
                        <span className="text-[#B25B3E]">*</span>
                      </label>
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          updateField("confirmPassword", e.target.value)
                        }
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col">
                        <label className="mb-1.5 block min-h-[20px] text-sm font-medium text-[#3D342E]">
                          Province <span className="text-[#B25B3E]">*</span>
                        </label>
                        <select
                          value={form.provinceId}
                          onChange={(e) => {
                            const selected = provinces.find(
                              (p) => String(p.provinceId) === e.target.value,
                            );
                            setForm((prev) => ({
                              ...prev,
                              provinceId: e.target.value,
                              provinceName: selected?.provinceName ?? "",
                              districtId: "",
                              districtName: "",
                            }));
                          }}
                          className={selectClass}
                          disabled={loadingProvinces}
                        >
                          <option value="">
                            {loadingProvinces ? "Loading..." : "Select province"}
                          </option>
                          {provinces.map((p) => (
                            <option key={p.provinceId} value={p.provinceId}>
                              {p.provinceName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1.5 block min-h-[20px] text-sm font-medium text-[#3D342E]">
                          District <span className="text-[#B25B3E]">*</span>
                        </label>
                        <select
                          value={form.districtId}
                          onChange={(e) => {
                            const selected = districts.find(
                              (d) => String(d.districtId) === e.target.value,
                            );
                            setForm((prev) => ({
                              ...prev,
                              districtId: e.target.value,
                              districtName: selected?.districtName ?? "",
                            }));
                          }}
                          className={selectClass}
                          disabled={!form.provinceId || loadingDistricts}
                        >
                          <option value="">
                            {!form.provinceId
                              ? "Select province first"
                              : loadingDistricts
                                ? "Loading..."
                                : "Select district"}
                          </option>
                          {districts.map((d) => (
                            <option key={d.districtId} value={d.districtId}>
                              {d.districtName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#3D342E]">
                        Address <span className="text-[#B25B3E]">*</span>
                      </label>
                      <textarea
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="Street, ward, municipality"
                        rows={2}
                        className="box-border w-full resize-none rounded-xl border border-[#E0D5CC] bg-white px-4 py-3 text-sm leading-normal text-[#2E1D17] outline-none placeholder:text-[#A59A90] focus:border-[#B25B3E]"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FileUploadField
                        label="Citizenship Front"
                        required
                        file={citizenshipFront}
                        onChange={setCitizenshipFront}
                      />
                      <FileUploadField
                        label="Citizenship Back"
                        required
                        file={citizenshipBack}
                        onChange={setCitizenshipBack}
                      />
                      <FileUploadField
                        label="Pan Registration"
                        required
                        file={panCard}
                        onChange={setPanCard}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-[#E8E0D8] bg-[#FAF7F3] p-4">
                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#B25B3E]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={14}
                            height={14}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                          </svg>
                          Important Notes
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed text-[#6B6560]">
                          <li>All documents must be clear and readable.</li>
                          <li>PDF, JPG, PNG (Max 5MB each).</li>
                          <li>Review within 2–3 business days.</li>
                        </ul>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E8E0D8] bg-white p-4">
                        <input
                          type="checkbox"
                          checked={form.agreedToTerms}
                          onChange={(e) =>
                            updateField("agreedToTerms", e.target.checked)
                          }
                          className="mt-0.5 h-4 w-4 rounded border-[#D8D1C9] text-[#B25B3E] focus:ring-[#B25B3E]"
                        />
                        <span className="text-sm leading-relaxed text-[#6B6560]">
                          I agree to the terms and conditions and confirm that
                          all information provided is accurate.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex shrink-0 items-center justify-between gap-4 border-t border-[#F0E6DA] pt-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="rounded-full border border-[#E0D5CC] bg-white px-6 py-2.5 text-sm font-medium text-[#6B6560] transition-colors hover:border-[#B25B3E] hover:text-[#B25B3E] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-[#B25B3E] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-full bg-[#B25B3E] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
