import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/api/queryClient.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        toastOptions={{
          classNames: {
            error: "bg-red-100",
            success: "bg-green-100",
            warning: "bg-yellow-100",
            info: "bg-blue-100",
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
