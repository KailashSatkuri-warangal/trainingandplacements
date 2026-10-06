import { useState, useEffect } from "react";
import { companyService } from "../services/companyService";

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await companyService.getActiveCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { companies, isLoading, error, refresh: fetchCompanies };
}
