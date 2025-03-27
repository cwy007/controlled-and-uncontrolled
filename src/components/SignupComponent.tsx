import { useRef, useState } from "react";

// 用于qa和sit环境的切换，方便测试
let newcoreHost = 'https://c2.xinheyun.com';
const threeChatAiEnv = localStorage.getItem("threeChatAiEnv");
if (threeChatAiEnv === 'qa') {
  newcoreHost = "https://qa.newcoretech.com";
}
if (threeChatAiEnv === "sit") {
  newcoreHost = "https://sit.newcoretech.com";
}

export default function SignupComponent() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const timerRef = useRef(0);
  const [count, setCount] = useState(0);

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      setError((oldError) => ({
        ...oldError,
        phone: "Please enter a valid 11-digit phone number",
      }));
      return;
    }
    setError({});
    // Here you would typically make an API call to send verification code
    try {
      const response = await fetch(
        `${newcoreHost}/api/basedata/userCenter/account/v1/sms/bind`,
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
      // Handle successful signup (e.g., store token, redirect)
      if (data.code === 200) {
        console.log("Signup successful:", data);
      } else {
        setError({ signup: "Send code failed. Please try again." });
      }
    } catch (err: any) {
      // setError("Signup failed. Please try again.");
      setError({ signup: "Send code failed. Please try again." });
    } finally {
      setLoading(false);
    }
    // in 60 seconds, the button can be clicked again
    let count = 60;
    setCount(60);
    timerRef.current = setInterval(() => {
      setCount((count) => count - 1);
      if (count <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (username == null || username === "") {
      setError((oldError) => ({
        ...oldError,
        username: "Username cannot be empty",
      }));
      return;
    }
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
        `${newcoreHost}/api/operation/multiOrg/account/phone/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: {
              mobilePhone: phone,
              smsCode: verifyCode,
              source: 5,
              account: username,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      // Handle successful signup (e.g., store token, redirect)
      if (data.code === 200) {
        console.log("Signup successful:", data);
        window.location.href = `${newcoreHost}/embedded-app/subapp?url=/butler/inbox`;
      } else {
        setError({ signup: "Signup failed. Please try again." });
      }
    } catch (err) {
      setError({ signup: "Signup failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form as any}>
        <div style={styles.inputGroup as any}>
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="tel"
            value={username}
            onChange={(e) => setUsername(e.target.value?.trim())}
            placeholder="Enter Username"
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

        {error.signup && <div style={styles.error as any}>{error.signup}</div>}

        <button
          type="submit"
          style={{
            ...styles.loginBtn,
            ...(loading ? styles.disabledButton : {}),
          }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign Up"}
        </button>

        <a href="/login" style={styles.createAccount as any}>
          Log in
        </a>
      </form>
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
    minWidth: "80px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.2s",
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
    textAlign: "center",
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
