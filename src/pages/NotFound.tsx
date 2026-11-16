import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center bg-background">
      <div className="wrap">
        <p className="font-mono text-sm text-faint">404</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight">This page does not exist</h1>
        <a href="/" className="link mt-8">
          Back to the portfolio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
