import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div>
      <h1>Hello👋 Get your ticket to your unforgettable event now</h1>
      <Link to={"/login"}>Login</Link>
      <Link to={"/register"}>Register</Link>
    </div>
  );
};
