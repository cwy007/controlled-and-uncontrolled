import { useRef, useState } from "react";
// import { addPropertyControls, ControlType } from "framer";

const VerifyCodeLogin = () => {
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(0)
  const [count, setCount] = useState(0)

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
    // setError("");
    setError({});
    // Here you would typically make an API call to send verification code
    try {
      const response = await fetch(
        "https://c2.xinheyun.com/api/basedata/userCenter/account/v1/sms/bind",
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
        setError({ login: "Send code failed. Please try again." });
      }
    } catch (err: any) {
      // setError("Login failed. Please try again.");
      setError({ login: "Send code failed. Please try again." });
    } finally {
      setLoading(false);
    }
    // in 60 seconds, the button can be clicked again
    let count = 60
    setCount(60)
    timerRef.current = setInterval(() => {
      setCount((count) => count - 1)
      if (count <= 0) {
        clearInterval(timerRef.current)
      }
    }, 1000)
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
        "https://c2.xinheyun.com/api-domain/user-center/authority/authority/v1/login/bySms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: {
              mobilePhone: phone,
              smsCode: verifyCode,
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
      } else {
        setError({ login: "Login failed. Please try again." });
      }
    } catch (err) {
      // setError("Login failed. Please try again.");
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
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter Phone Number"
          maxLength="11"
          style={styles.input}
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
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            maxLength="6"
            style={{ ...styles.input, flex: 1 }}
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

      {error.login && <div style={styles.error as any}>{error.login}</div>}

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

const PasswordLogin = () => {
  // const [activeTab, setActiveTab] = useState("verify");
  // const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
        "https://c2.xinheyun.com/api-domain/user-center/authority/authority/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: {
              account: username,
              password: password,
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
      } else {
        setError({ login: "Login failed. Please try again." });
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
          style={styles.input}
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
          style={styles.input}
        />
        {error.password && <div style={styles.errorLeft as any}>{error.password}</div>}
      </div>

      {error.login && <div style={styles.error as any}>{error.login}</div>}

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
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // 手机号长度校验
  // const validatePhone = (phoneNumber) => {
  //   const phoneRegex = /^\d{11}$/;
  //   return phoneRegex.test(phoneNumber);
  // };

  // const handleSendCode = async () => {
  //   if (!validatePhone(phone)) {
  //     setError((oldError) => ({
  //       ...oldError,
  //       phone: "Please enter a valid 11-digit phone number",
  //     }));
  //     return;
  //   }
  //   // setError("");
  //   setError({});
  //   // Here you would typically make an API call to send verification code
  // };

  // const handleSmsLogin = async (e) => {
  //   e.preventDefault();
  //   if (!validatePhone(phone)) {
  //     setError((oldError) => ({
  //       ...oldError,
  //       phone: "Please enter a valid 11-digit phone number",
  //     }));
  //     return;
  //   }
  //   if (!verifyCode || verifyCode.length !== 6) {
  //     setError((oldError) => ({
  //       ...oldError,
  //       verifyCode: "Please enter a valid 6-digit verification code",
  //     }));
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       "https://c2.xinheyun.com/api-domain/user-center/authority/authority/v1/login/bySms",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           phone,
  //           verifyCode,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Login failed");
  //     }

  //     const data = await response.json();
  //     // Handle successful login (e.g., store token, redirect)
  //     if (data.code === 200) {
  //       console.log("Login successful:", data);
  //     } else {
  //       setError({ login: "Login failed. Please try again." });
  //     }
  //   } catch (err) {
  //     // setError("Login failed. Please try again.");
  //     setError({ login: "Login failed. Please try again." });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (username == null || username === "") {
      setError((oldError) => ({
        ...oldError,
        verifyCode: "Username cannot be empty",
      }));
      return;
    }
    if (password == null || password === "") {
      setError((oldError) => ({
        ...oldError,
        verifyCode: "Password cannot be empty",
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://c2.xinheyun.com/api-domain/user-center/authority/authority/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: username,
            password: password,
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
      } else {
        setError({ login: "Login failed. Please try again." });
      }
    } catch (err) {
      setError({ login: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
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

      {activeTab === "verify" && <VerifyCodeLogin />}
      {activeTab === "password" && <PasswordLogin />}

      {/* {activeTab === "verify" && (
        <form onSubmit={handleSmsLogin} style={styles.form as any}>
          <div style={styles.inputGroup as any}>
            <label htmlFor="phone" style={styles.label}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter Phone Number"
              maxLength="11"
              style={styles.input}
            />
            {error.phone && <div style={styles.error as any}>{error.phone}</div>}
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
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                maxLength="6"
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSendCode}
                style={{
                  ...styles.sendCodeBtn,
                  ...(loading ? styles.disabledButton : {}),
                }}
                disabled={loading}
              >
                Send Code
              </button>
            </div>
            {error.verifyCode && <div style={styles.error as any}>{error.verifyCode}</div>}
          </div>

          {error.login && <div style={styles.error as any}>{error.login}</div>}

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
      )} */}

      {/* {activeTab === "password" && (
        <form onSubmit={handlePasswordLogin} style={styles.form as any}>
          <div style={styles.inputGroup as any}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="tel"
              value={phone}
              onChange={(e) => setUsername(e.target.value?.trim())}
              placeholder="Enter Phone / Username"
              style={styles.input}
            />
            {error.username && <div style={styles.error as any}>{error.username}</div>}
          </div>

          <div style={styles.inputGroup as any}>
            <label htmlFor="password" style={styles.label}>
              Verify Code
            </label>
            <input
              id="password"
              type="password"
              value={verifyCode}
              onChange={(e) => setPassword(e.target.value?.trim())}
              placeholder="Enter Password"
              style={styles.input}
            />
            {error.password && <div style={styles.error as any}>{error.password}</div>}
          </div>

          {error.login && <div style={styles.error as any}>{error.login}</div>}

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
      )} */}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 400,
    margin: "0 auto",
    padding: "2rem",
  },
  tabs: {
    display: "flex",
    marginBottom: "2rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  tab: {
    background: "none",
    border: "none",
    padding: "1rem",
    color: "#888",
    cursor: "pointer",
    fontSize: "1rem",
    position: "relative",
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
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    color: "#888",
    fontSize: "0.9rem",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: 8,
    padding: "0.8rem 1rem",
    color: "#fff",
    fontSize: "1rem",
  },
  verifyCodeContainer: {
    display: "flex",
    gap: "0.5rem",
  },
  sendCodeBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#fff",
    padding: "0 1.5rem",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  loginBtn: {
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
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
  },
  createAccount: {
    color: "#0066ff",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "0.9rem",
  },
};
