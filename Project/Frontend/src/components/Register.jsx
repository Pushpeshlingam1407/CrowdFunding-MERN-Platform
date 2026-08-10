import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Building2,
  Briefcase,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { toast as hotToast } from "react-hot-toast";
import { toast as sonnerToast } from "sonner";
import { Button, Input, Card, Container, Flex, Grid } from "./ui";
import api from "../services/api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "startup",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const isFirstNameValid = formData.firstName.trim().length >= 2;
  const isLastNameValid = formData.lastName.trim().length >= 2;

  // Email validation regex check
  const isEmailValid = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
    formData.email.trim(),
  );

  // Password criteria checks matching AuthController's complexity rule
  const pass = formData.password;
  const hasMinLength = pass.length >= 8;
  const hasUppercase = /[A-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':",.<>?]/.test(pass);
  const isPasswordValid =
    hasMinLength && hasUppercase && hasNumber && hasSpecial;

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (emailTouched && isEmailValid) {
        setCheckingEmail(true);
        try {
          const res = await api.get(
            `/auth/check-email?email=${encodeURIComponent(formData.email.trim())}`,
          );
          setEmailExists(res.data.exists);
        } catch (error) {
          console.error("Error checking email", error);
        } finally {
          setCheckingEmail(false);
        }
      } else {
        setEmailExists(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.email, emailTouched, isEmailValid]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (e.target.name === "firstName") setFirstNameTouched(true);
    if (e.target.name === "lastName") setLastNameTouched(true);
    if (e.target.name === "email") setEmailTouched(true);
    if (e.target.name === "password") setPasswordTouched(true);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFirstNameValid || !isLastNameValid) {
      hotToast.error("First and last name must be at least 2 characters");
      return;
    }

    if (!formData.agreeToTerms) {
      sonnerToast.error("Please agree to the terms and conditions");
      return;
    }

    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (emailExists) {
      sonnerToast.error("An account with this email already exists");
      return;
    }

    if (!isPasswordValid) {
      hotToast.error(
        "Password must be at least 8 characters and include an uppercase letter, a number, and a special character",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const {
        confirmPassword,
        agreeToTerms,
        firstName,
        lastName,
        ...registerData
      } = formData;
      registerData.name = `${firstName} ${lastName}`.trim();

      await api.post("/auth/register", registerData);

      sonnerToast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      hotToast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <Container>
        <Flex justify="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="auth-form-wrapper-wide"
          >
            <div className="register-card">
              <h2 className="register-title">Create Account</h2>
              <p className="register-subtitle">
                Join the premium crowdfunding ecosystem
              </p>

              <form onSubmit={handleSubmit}>
                <Grid cols={2} gap="1rem">
                  <div className="register-form-group">
                    <label className="register-label">First Name</label>
                    <input
                      className={`register-input ${firstNameTouched && isFirstNameValid ? "is-valid" : ""} ${firstNameTouched && !isFirstNameValid ? "has-error" : ""}`}
                      type="text"
                      name="firstName"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}

                      required
                    />
                    {firstNameTouched && (
                      <div
                        className={`register-validation-indicator ${isFirstNameValid ? "is-valid" : "has-error"}`}
                      >
                        {isFirstNameValid ? (
                          <>
                            <Check size={14} /> First name{" "}
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} /> At least 2 characters
                            required
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="register-form-group">
                    <label className="register-label">Last Name</label>
                    <input
                      className={`register-input ${lastNameTouched && isLastNameValid ? "is-valid" : ""} ${lastNameTouched && !isLastNameValid ? "has-error" : ""}`}
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}

                      required
                    />
                    {lastNameTouched && (
                      <div
                        className={`register-validation-indicator ${isLastNameValid ? "is-valid" : "has-error"}`}
                      >
                        {isLastNameValid ? (
                          <>
                            <Check size={14} /> Last name
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} /> At least 2 characters
                            required
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Grid>

                <div className="register-form-group">
                  <label className="register-label">Email Address</label>
                  <input
                    className={`register-input ${emailTouched && isEmailValid && !emailExists ? "is-valid" : ""} ${emailTouched && (!isEmailValid || emailExists) ? "has-error" : ""}`}
                    type="email"
                    name="email"
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={handleChange}

                    required
                  />
                  {emailTouched && (
                    <div
                      className={`register-validation-indicator ${isEmailValid && !emailExists ? "is-valid" : "has-error"}`}
                    >
                      {checkingEmail ? (
                        <>
                          <AlertCircle size={14} /> Checking email...
                        </>
                      ) : !isEmailValid ? (
                        <>
                          <AlertCircle size={14} /> Please enter a valid email
                          format
                        </>
                      ) : emailExists ? (
                        <>
                          <X size={14} /> Email already exists
                        </>
                      ) : (
                        <>
                          <Check size={14} /> Email address is valid
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Password</label>
                  <input
                    className={`register-input ${passwordTouched && isPasswordValid ? "is-valid" : ""} ${passwordTouched && !isPasswordValid ? "has-error" : ""}`}
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}

                    required
                  />
                  {passwordTouched && (
                    <div className="register-criteria-list">
                      <div
                        className={`register-criteria-item ${hasMinLength ? "is-valid" : "is-invalid"}`}
                      >
                        {hasMinLength ? <Check size={12} /> : <X size={12} />}{" "}
                        At least 8 characters
                      </div>
                      <div
                        className={`register-criteria-item ${hasUppercase ? "is-valid" : "is-invalid"}`}
                      >
                        {hasUppercase ? <Check size={12} /> : <X size={12} />}{" "}
                        One uppercase letter
                      </div>
                      <div
                        className={`register-criteria-item ${hasNumber ? "is-valid" : "is-invalid"}`}
                      >
                        {hasNumber ? <Check size={12} /> : <X size={12} />} One
                        number
                      </div>
                      <div
                        className={`register-criteria-item ${hasSpecial ? "is-valid" : "is-invalid"}`}
                      >
                        {hasSpecial ? <Check size={12} /> : <X size={12} />} One
                        special character (!@#$%^&*)
                      </div>
                    </div>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Confirm Password</label>
                  <input
                    className={`register-input ${false ? "is-valid" : ""} ${false ? "has-error" : ""}`}
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    $isValid={
                      formData.confirmPassword &&
                      formData.password === formData.confirmPassword
                    }
                    $hasError={
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                    }
                    required
                  />
                  {formData.confirmPassword && (
                    <div
                      className={`register-validation-indicator ${formData.password === formData.confirmPassword ? "is-valid" : "has-error"}`}
                    >
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <Check size={14} /> Passwords match
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} /> Passwords do not match
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="register-form-group register-role-group">
                  <label className="register-label">I am a...</label>
                  <div className="register-role-grid">
                    {[
                      { value: "startup", label: "Startup", icon: Building2 },
                      {
                        value: "investor",
                        label: "Single Investor",
                        icon: User,
                      },
                      {
                        value: "mnc",
                        label: "MNC / Enterprise",
                        icon: Briefcase,
                      },
                      {
                        value: "employee",
                        label: "Individual Employee",
                        icon: Briefcase,
                      },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          className={`register-role-card ${formData.role === opt.value ? "active" : ""}`}
                          onClick={() =>
                            setFormData({ ...formData, role: opt.value })
                          }
                        >
                          <Icon size={16} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="register-checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms" className="register-link">
                      Terms of Service
                    </Link>
                    ,
                    <Link to="/privacy" className="register-link">
                      {" "}
                      Privacy Policy
                    </Link>
                    , and
                    <Link to="/agreement" className="register-link">
                      {" "}
                      User Agreement
                    </Link>
                    .
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={loading}
                  className="register-submit-btn btn-primary-dark"
                >
                  <UserPlus size={18} className="icon-mr" />
                  {loading ? "Creating Account..." : "Join StartupFund"}
                </Button>

                <div className="register-link-container">
                  <span className="text-muted-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="register-link">
                      Log in
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </Flex>
      </Container>
    </div>
  );
};

export default Register;
