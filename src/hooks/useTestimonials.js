import { useState, useEffect } from "react";
import { testimonialService } from "../services/testimonialService";

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await testimonialService.getPublishedTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return { testimonials, isLoading, error, refresh: fetchTestimonials };
}
