import { useState, useEffect, useCallback } from "react";
import { driveService } from "../services/driveService";

export function useDrives(initialFilters = {}) {
  const [drives, setDrives] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialFilters.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "All Drives",
    location: "",
    experience: "All Experience",
    workMode: "All Work Modes",
    sortBy: "newest",
    limit: 12,
    ...initialFilters
  });

  const fetchDrives = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await driveService.getPublishedDrives({
        page,
        limit: filters.limit,
        search: filters.search,
        categoryId: filters.categoryId && filters.categoryId !== "All Drives" ? filters.categoryId : undefined,
        categoryName: filters.categoryName && filters.categoryName !== "All Drives" ? filters.categoryName : (filters.category && filters.category !== "All Drives" ? filters.category : undefined),
        location: filters.location,
        experience: filters.experience !== "All Experience" ? filters.experience : undefined,
        workMode: filters.workMode !== "All Work Modes" ? filters.workMode : undefined,
        sortBy: filters.sortBy
      });

      setDrives(res.drives);
      setTotal(res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categoryId: "All Drives",
      location: "",
      experience: "All Experience",
      workMode: "All Work Modes",
      sortBy: "newest",
      limit: 12
    });
    setPage(1);
  };

  return {
    drives,
    total,
    page,
    setPage,
    totalPages,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refresh: fetchDrives
  };
}
