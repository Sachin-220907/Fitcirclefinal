import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js";
import { useAuth } from "../context/AuthContext";
import "flag-icons/css/flag-icons.min.css";
import "../styles/authentication.css";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const countries = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) || code,
    dialCode: `+${getCountryCallingCode(code)}`
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function PhoneSignupPage() {
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const selected = countries.find((country) => country.code === selectedCountry) || countries[0];

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.dialCode.includes(countrySearch)
  );

  function handleSendOTP(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidPhoneNumber(phone, selectedCountry)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setError("");
    setOtpSent(true);
  }

  async function handleVerifyOTP(event) {
    event.preventDefault();
    await signup({ displayName: name });
    navigate("/dashboard");
  }

  return (
    <main className="auth-welcome">
      <div className="auth-container">
        <img
          src="/images/fitcircle-logo.png"
          alt="FitCircle Logo"
          className="auth-logo"
        />

        <h1>Create Account with Phone</h1>
        <p className="auth-subtitle">
          {otpSent ? "Enter the verification code sent to your phone." : "Quick registration via SMS verification."}
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="auth-actions">
            <input
              type="text"
              placeholder="Your Full Name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="phone-input-wrapper">
              <button
                type="button"
                className="country-picker-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className={`fi fi-${selected.code.toLowerCase()}`} />
                <span>{selected.dialCode}</span>
                <span className="picker-arrow">▾</span>
              </button>

              <input
                type="tel"
                placeholder="Phone number"
                className="auth-input phone-number-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {dropdownOpen && (
              <div className="country-dropdown-menu">
                <input
                  type="text"
                  placeholder="Search countries..."
                  className="country-search-input"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                />
                <div className="countries-scroll-list">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className="country-item-btn"
                      onClick={() => {
                        setSelectedCountry(c.code);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className={`fi fi-${c.code.toLowerCase()}`} />
                      <span className="c-name">{c.name}</span>
                      <span className="c-dial">{c.dialCode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="auth-button auth-primary">
              Send SMS Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="auth-actions">
            <input
              type="text"
              placeholder="Enter 4-digit code (e.g. 1234)"
              className="auth-input otp-field"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button type="submit" className="auth-button auth-primary">
              Verify & Complete Registration
            </button>

            <button
              type="button"
              className="btn-text-link"
              onClick={() => setOtpSent(false)}
            >
              ← Back to Details
            </button>
          </form>
        )}

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
}

export default PhoneSignupPage;
