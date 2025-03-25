import React from "react";
import SignupComponent from "../../components/SignupComponent";

const Signup = () => {
  return (
    <div
      style={{
        backgroundColor: "#000",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SignupComponent />
    </div>
  );
};

export default Signup;
