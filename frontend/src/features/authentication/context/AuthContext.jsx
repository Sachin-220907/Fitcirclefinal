import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const DEMO_USER = {
  id: "usr_demo_8829",
  displayName: "Sachin",
  username: "sachin",
  email: "sachin@fitcircle.app",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  bio: "Fitness enthusiast, marathon runner & wellness advocate. Working on personal endurance records!",
  gender: "Male",
  onboarded: true,
  stats: {
    height: 178,
    heightUnit: "cm",
    weight: 72.5,
    weightUnit: "kg",
    targetWeight: 70,
    targetWeightUnit: "kg",
    fitnessGoal: "Endurance & Lean Muscle",
    activityLevel: "Moderately Active",
    streakDays: 14,
    points: 2890,
    level: "Gold Tier Athlete"
  }
};

const INITIAL_TAKEN_USERNAMES = ["sachin", "admin", "fitcircle", "coach_alex", "sarah_fit"];
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
  .replace(/\/+$/, "");

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fitcircle_user");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_USER;
  });

  const [takenUsernames, setTakenUsernames] = useState(() => {
    try {
      const saved = localStorage.getItem("fitcircle_usernames");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TAKEN_USERNAMES;
  });

  const [loading, setLoading] = useState(false);

  function checkUsernameAvailable(uname, currentUserId = null) {
    if (!uname) return false;
    const clean = uname.trim().toLowerCase().replace(/^@/, "");
    if (user && user.id === currentUserId && user.username.toLowerCase() === clean) {
      return true;
    }
    return !takenUsernames.includes(clean);
  }

  async function loginWithDemo() {
    setUser(DEMO_USER);
    localStorage.setItem("fitcircle_user", JSON.stringify(DEMO_USER));
    return DEMO_USER;
  }

  async function login(email, password) {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const authedUser = data.user || data;
        setUser(authedUser);
        localStorage.setItem("fitcircle_user", JSON.stringify(authedUser));
        return { success: true, user: authedUser };
      }
    } catch {
      // backend offline
    } finally {
      setLoading(false);
    }

    // Match locally registered users if offline
    const registeredUsers = JSON.parse(localStorage.getItem("fitcircle_all_users") || "[]");
    const matched = registeredUsers.find((u) => u.email === email);
    const resolvedUser = matched || {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      displayName: email ? email.split("@")[0] : DEMO_USER.displayName
    };

    setUser(resolvedUser);
    localStorage.setItem("fitcircle_user", JSON.stringify(resolvedUser));
    return { success: true, user: resolvedUser };
  }

  // Handle authenticating with Google payload
  function loginWithGoogleProfile(googleProfile) {
    const existingUsers = JSON.parse(localStorage.getItem("fitcircle_all_users") || "[]");
    const found = existingUsers.find((u) => u.email === googleProfile.email);

    const authedUser = found
      ? { ...found, avatarUrl: googleProfile.picture || found.avatarUrl, displayName: googleProfile.name || found.displayName }
      : {
          id: "google_" + (googleProfile.sub || Date.now()),
          displayName: googleProfile.name || "Google Athlete",
          username: (googleProfile.email ? googleProfile.email.split("@")[0] : "athlete").toLowerCase().replace(/[^a-z0-9_]/g, ""),
          email: googleProfile.email,
          avatarUrl: googleProfile.picture || DEMO_USER.avatarUrl,
          bio: "Passionate about health, fitness and peak performance.",
          gender: "Prefer not to say",
          onboarded: true,
          stats: { ...DEMO_USER.stats }
        };

    setUser(authedUser);
    localStorage.setItem("fitcircle_user", JSON.stringify(authedUser));
    return authedUser;
  }

  async function signup({ displayName, email, password, username, avatarUrl }) {
    setLoading(true);

    const cleanUsername = username
      ? username.trim().toLowerCase().replace(/^@/, "")
      : `${displayName.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Math.floor(100 + Math.random() * 900)}`;

    const newUser = {
      id: "usr_" + Date.now(),
      displayName: displayName.trim(),
      username: cleanUsername,
      email: email.trim(),
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
      bio: "Excited to begin my fitness journey on FitCircle!",
      gender: null,
      onboarded: false, // Mandatory onboarding required before dashboard access!
      stats: {
        height: 175,
        heightUnit: "cm",
        weight: 70,
        weightUnit: "kg",
        targetWeight: 68,
        targetWeightUnit: "kg",
        fitnessGoal: "General Fitness",
        activityLevel: "Moderately Active",
        streakDays: 1,
        points: 100,
        level: "Rookie Athlete"
      }
    };

    const nextUsernames = [...new Set([...takenUsernames, cleanUsername])];
    setTakenUsernames(nextUsernames);
    localStorage.setItem("fitcircle_usernames", JSON.stringify(nextUsernames));

    const registeredUsers = JSON.parse(localStorage.getItem("fitcircle_all_users") || "[]");
    registeredUsers.push(newUser);
    localStorage.setItem("fitcircle_all_users", JSON.stringify(registeredUsers));

    setUser(newUser);
    localStorage.setItem("fitcircle_user", JSON.stringify(newUser));
    setLoading(false);

    return { success: true, user: newUser };
  }

  function completeOnboarding(onboardingData) {
    const updated = {
      ...user,
      gender: onboardingData.gender,
      onboarded: true,
      avatarUrl: onboardingData.avatarUrl || user?.avatarUrl,
      username: onboardingData.username || user?.username,
      displayName: onboardingData.displayName || user?.displayName,
      stats: {
        ...(user?.stats || {}),
        height: Number(onboardingData.height),
        heightUnit: onboardingData.heightUnit || "cm",
        weight: Number(onboardingData.weight),
        weightUnit: onboardingData.weightUnit || "kg",
        targetWeight: Number(onboardingData.targetWeight),
        targetWeightUnit: onboardingData.targetWeightUnit || "kg",
        fitnessGoal: onboardingData.fitnessGoal || "General Fitness"
      }
    };

    setUser(updated);
    localStorage.setItem("fitcircle_user", JSON.stringify(updated));
    return updated;
  }

  function updateUser(updatedFields) {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("fitcircle_user", JSON.stringify(updated));
      return updated;
    });
  }

  async function logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch {
      // offline
    } finally {
      setUser(null);
      localStorage.removeItem("fitcircle_user");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithDemo,
        loginWithGoogleProfile,
        signup,
        completeOnboarding,
        checkUsernameAvailable,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export default AuthContext;
