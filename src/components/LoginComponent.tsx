import { useEffect, useRef, useState } from "react";

/** 用于qa和sit环境的切换，方便测试 */
const getNewcoreHost = () => {
  let host = 'https://c2.xinheyun.com';
  const threeChatAiEnv = localStorage.getItem("threeChatAiEnv");
  if (threeChatAiEnv === 'qa') {
    host = "https://qa.newcoretech.com";
  }
  if (threeChatAiEnv === "sit") {
    host = "https://sit.newcoretech.com";
  }
  return host;
}

const loginByCrossToken = (crossToken) => {
  const host = getNewcoreHost();
  const redirectUrl = `${host}/embedded-app/subapp?url=/butler/inbox`;
  const crossOriginLoginUrl = `${host}/home-app/cross-origin-login`;
  window.location.href = `${crossOriginLoginUrl}?crossToken=${crossToken}&redirectUrl=${redirectUrl}`;
}

const VerifyCodeLogin = ({
  error,
  setError,
}: {
  error: Record<string, string>;
  setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(0);
  const [count, setCount] = useState(0);
  const [focusedInput, setFocusedInput] = useState("");

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendCode = async () => {
    console.log("handleSendCode-->", Date.now());
    if (!validatePhone(phone)) {
      setError((oldError) => ({
        ...oldError,
        phone: "Please enter a valid 11-digit phone number",
      }));
      return;
    }
    // setError("");
    setError({});
    // Here you would typically make an API call to send verification code
    try {
      const response = await fetch(
        `${getNewcoreHost()}/api-domain/user-center/authority/authority/register/sms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: {
              mobilePhone: phone,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Send code failed");
      }

      const data = await response.json();
      // Handle successful login (e.g., store token, redirect)
      if (data.code === 200) {
        console.log("Login successful:", data);
      } else {
        setError({ login: data.message || "Send code failed. Please try again." });
      }
    } catch (err: any) {
      // setError("Login failed. Please try again.");
      setError({ login: "Send code failed. Please try again." });
    } finally {
      setLoading(false);
    }
    // in 60 seconds, the button can be clicked again
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    let count = 60;
    setCount(60);
    timerRef.current = setInterval(() => {
      setCount((count) => count - 1);
      if (count <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);
  };

  const handleSmsLogin = async (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setError((oldError) => ({
        ...oldError,
        phone: "Please enter a valid 11-digit phone number",
      }));
      return;
    }
    if (!verifyCode || verifyCode.length !== 6) {
      setError((oldError) => ({
        ...oldError,
        verifyCode: "Please enter a valid 6-digit verification code",
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${getNewcoreHost()}/api-domain/user-center/authority/authority/v1/login/bySms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: {
              mobilePhone: phone,
              smsCode: verifyCode,
              crossToken: true,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // Handle successful login (e.g., store token, redirect)
      if (data.code === 200) {
        console.log("Login successful:", data);
        const crossToken = data.data?.entity?.crossToken;
        if (crossToken) {
          loginByCrossToken(crossToken);
        }
      } else {
        setError({ login: data.message || "Login failed. Please try again." });
      }
    } catch (err) {
      setError({ login: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSmsLogin} style={styles.form as any}>
      <div style={styles.inputGroup as any}>
        <label htmlFor="phone" style={styles.label}>
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, ""));
            if (error.phone && !validatePhone(phone)) {
              setError((oldError) => ({
                ...oldError,
                phone: "Please enter a valid 11-digit phone number",
              }));
            } else {
              setError((oldError) => ({
                ...oldError,
                phone: "",
              }));
            }
          }}
          placeholder="Enter Phone Number"
          maxLength="11"
          style={{
            ...styles.input,
            ...(focusedInput === "phone" ? styles.inputFocused : {}),
            ...(error.phone ? styles.inputInvalid : {}),
          }}
          onFocus={() => setFocusedInput("phone")}
          onBlur={() => setFocusedInput("")}
        />
        {error.phone && <div style={styles.errorLeft as any}>{error.phone}</div>}
      </div>

      <div style={styles.inputGroup as any}>
        <label htmlFor="verifyCode" style={styles.label}>
          Verify Code
        </label>
        <div style={styles.verifyCodeContainer}>
          <input
            id="verifyCode"
            type="text"
            value={verifyCode}
            onChange={(e) => {
              // replace(/\D/g, "") to allow only digits
              setVerifyCode(e.target.value.replace(/\D/g, ""));
              if (error.verifyCode && (!verifyCode || verifyCode.length !== 6)) {
                setError((oldError) => ({
                  ...oldError,
                  verifyCode: "Please enter a valid 6-digit verification code",
                }));
              } else {
                setError((oldError) => ({
                  ...oldError,
                  verifyCode: "",
                }));
              }
            }}
            placeholder="6-digit code"
            maxLength="6"
            style={{
              ...styles.input,
              flex: 1,
              ...(focusedInput === "verifyCode" ? styles.inputFocused : {}),
              ...(error.verifyCode ? styles.inputInvalid : {}),
            }}
            onFocus={() => setFocusedInput("verifyCode")}
            onBlur={() => setFocusedInput("")}
          />
          <button
            type="button"
            onClick={handleSendCode}
            style={{
              ...styles.sendCodeBtn,
              ...(loading ? styles.disabledButton : {}),
            }}
            disabled={loading || count > 0}
          >
            {count > 0 ? `${count} s` : "Send Code"}
          </button>
        </div>
        {error.verifyCode && <div style={styles.errorLeft as any}>{error.verifyCode}</div>}
      </div>

      <button
        type="submit"
        style={{
          ...styles.loginBtn,
          ...(loading ? styles.disabledButton : {}),
        }}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      <a href="/signup" style={styles.createAccount as any}>
        Create an account
      </a>
    </form>
  );
};

const PasswordLogin = ({
  error,
  setError,
}: {
  error: Record<string, string>;
  setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (username == null || username === "") {
      setError((oldError) => ({
        ...oldError,
        username: "Username cannot be empty",
      }));
      return;
    }
    if (password == null || password === "") {
      setError((oldError) => ({
        ...oldError,
        password: "Password cannot be empty",
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${getNewcoreHost()}/api-domain/user-center/authority/authority/v1/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: {
              account: username,
              password: password,
              crossToken: true,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // Handle successful login (e.g., store token, redirect)
      if (data.code === 200) {
        console.log("Login successful:", data);
        const crossToken = data.data?.entity?.crossToken;
        if (crossToken) {
          loginByCrossToken(crossToken);
        }
      } else {
        setError({ login: data.message || "Login failed. Please try again." });
      }
    } catch (err) {
      setError({ login: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordLogin} style={styles.form as any}>
      <div style={styles.inputGroup as any}>
        <label htmlFor="username" style={styles.label}>
          Username
        </label>
        <input
          id="username"
          type="tel"
          value={username}
          onChange={(e) => setUsername(e.target.value?.trim())}
          placeholder="Enter Phone / Username"
          style={{
            ...styles.input,
            ...(focusedInput === "username" ? styles.inputFocused : {}),
            ...(error.username ? styles.inputInvalid : {}),
          }}
          onFocus={() => setFocusedInput("username")}
          onBlur={() => setFocusedInput("")}
        />
        {error.username && <div style={styles.errorLeft as any}>{error.username}</div>}
      </div>

      <div style={styles.inputGroup as any}>
        <label htmlFor="password" style={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value?.trim())}
          placeholder="Enter Password"
          style={{
            ...styles.input,
            ...(focusedInput === "password" ? styles.inputFocused : {}),
            ...(error.password ? styles.inputInvalid : {}),
          }}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput("")}
        />
        {error.password && <div style={styles.errorLeft as any}>{error.password}</div>}
      </div>

      <button
        type="submit"
        style={{
          ...styles.loginBtn,
          ...(loading ? styles.disabledButton : {}),
        }}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      <a href="/signup" style={styles.createAccount as any}>
        Create an account
      </a>
    </form>
  );
};

export default function LoginComponent() {
  const [activeTab, setActiveTab] = useState("verify");
  const [error, setError] = useState<Record<string, string>>({});

  return (
    <div style={styles.container}>
      {error.login && (
        <div style={styles.apiError}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            rotate={"180deg"}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12.01" y1="7" y2="8" />
            <line x1="12" x2="12" y1="11" y2="18" />
          </svg>
          <div style={styles.error as any}>{error.login}</div>
        </div>
      )}
      <div style={styles.tabs}>
        <button
          style={
            {
              ...styles.tab,
              ...(activeTab === "verify" ? styles.activeTab : {}),
            } as any
          }
          onClick={() => setActiveTab("verify")}
        >
          Verify Code
        </button>
        <button
          style={
            {
              ...styles.tab,
              ...(activeTab === "password" ? styles.activeTab : {}),
            } as any
          }
          onClick={() => setActiveTab("password")}
        >
          Password
        </button>
      </div>

      {activeTab === "verify" && <VerifyCodeLogin error={error} setError={setError} />}
      {activeTab === "password" && <PasswordLogin error={error} setError={setError} />}
    </div>
  );
}

const styles = {
  container: {
    // width: "100%",
    width: "calc(100vw - 2rem)",
    maxWidth: "500px",
    minWidth: "280px",
    margin: "0 auto",
    padding: "2rem",
    "@media (max-width: 480px)": {
      padding: "1rem",
      width: "calc(100vw - 1rem)",
      margin: "0.5rem",
    },
  },
  apiError: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "0.5rem",
    padding: "1rem",
    marginBottom: "1.5rem",
    borderRadius: "10px",
    color: "#F21B1B",
    backgroundColor: "rgba(255, 36, 36, 0.15)",
    fontSize: "0.9rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "@media (max-width: 480px)": {
      fontSize: "0.85rem",
    },
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    width: "100%",
    gap: "1rem",
  },
  tab: {
    width: "120px",
    background: "none",
    border: "none",
    padding: "1rem",
    color: "#888",
    cursor: "pointer",
    fontSize: "1rem",
    position: "relative",

    "@media (max-width: 480px)": {
      padding: "0.75rem",
      fontSize: "0.9rem",
    },
  },
  activeTab: {
    color: "#fff",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: "#fff",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    "@media (max-width: 480px)": {
      gap: "1.25rem",
    },
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    color: "#888",
    fontSize: "0.9rem",
    "@media (max-width: 480px)": {
      fontSize: "0.85rem",
    },
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid transparent",
    // border: "none",
    borderRadius: 8,
    padding: "0.8rem 1rem",
    color: "#fff",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    outline: "none",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.3)",
    },
    "@media (max-width: 480px)": {
      padding: "0.75rem",
      fontSize: "0.95rem",
    },
  },
  inputFocused: {
    borderColor: "#0066ff",
    boxShadow: "0 0 0 2px rgba(0, 102, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  inputInvalid: {
    borderColor: "#FF2121",
    boxShadow: "0 0 0 1px #FF2121",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  verifyCodeContainer: {
    display: "flex",
    gap: "0.5rem",
    "@media (max-width: 480px)": {
      gap: "0.25rem",
    },
  },
  sendCodeBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#fff",
    // padding: "0 1.5rem",
    minWidth: "80px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.2s",
    // minWidth: '118px',
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "#fff",
    },
    "&:focus-visible": {
      borderColor: "#0066ff",
      boxShadow: "0 0 0 2px rgba(0, 102, 255, 0.2)",
    },
    "@media (max-width: 480px)": {
      // padding: "0 0.5rem",
      fontSize: "0.85rem",
    },
  },
  loginBtn: {
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "opacity 0.2s",
    "&:hover": {
      backgroundColor: "#0052cc",
    },
    "&:focus-visible": {
      boxShadow: "0 0 0 2px rgba(0, 102, 255, 0.2)",
    },
    "@media (max-width: 480px)": {
      padding: "0.875rem",
      fontSize: "0.95rem",
    },
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none",
  },
  errorLeft: {
    color: "#ff4444",
    fontSize: "0.9rem",
    textAlign: "left",
  },
  error: {
    color: "#ff4444",
    fontSize: "0.9rem",
    textAlign: "left",
    "@media (max-width: 480px)": {
      fontSize: "0.85rem",
    },
  },
  createAccount: {
    color: "#0066ff",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "0.9rem",
    "&:hover": {
      color: "#0052cc",
      textDecoration: "underline",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.85rem",
    },
  },
};
