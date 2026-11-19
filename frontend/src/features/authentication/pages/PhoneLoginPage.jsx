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

export function PhoneLoginPage() {
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { loginWithDemo } = useAuth();
  const navigate = useNavigate();

  const selected = countries.find((country) => country.code === selectedCountry) || countries[0];

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.dialCode.includes(countrySearch)
  );

  function handleSendOTP(event) {
    event.preventDefault();

    if (!isValidPhoneNumber(phone, selectedCountry)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setError("");
    setOtpSent(true);
  }

  async function handleVerifyOTP(event) {
    event.preventDefault();
    if (otp.length < 4) {
      setError("Please enter a 4-digit verification code.");
      return;
    }

    setIsVerifying(true);
    await loginWithDemo();
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

        <h1>Sign In with Phone</h1>
        <p className="auth-subtitle">
          {otpSent
            ? "Enter the 4-digit code sent to your phone."
            : "We'll send you a verification code via SMS."}
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="auth-actions">
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
              Send Verification Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="auth-actions">
            <input
              type="text"
              placeholder="Enter 4-digit OTP (e.g. 1234)"
              className="auth-input otp-field"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button
              type="submit"
              className="auth-button auth-primary"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              className="btn-text-link"
              onClick={() => setOtpSent(false)}
            >
              ← Change Phone Number
            </button>
          </form>
        )}

        <p className="auth-footer">
          Prefer email? <Link to="/login">Sign in with Email</Link>
        </p>
      </div>
    </main>
  );
}

export default PhoneLoginPage;
