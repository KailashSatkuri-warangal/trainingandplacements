import { useState, useMemo, useEffect, useCallback } from "react";
import { JOBS_DATA } from "../data/jobs";
import { jobsService } from "../services/jobsService";

export function useJobFilters(initialCategory = "All Drives") {
  const [jobs, setJobs] = useState(JOBS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedWorkMode, setSelectedWorkMode] = useState("All Work Modes");
  const [selectedExperience, setSelectedExperience] = useState("All Experience");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch jobs dynamically from Supabase PostgreSQL
  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetched = await jobsService.getAllJobs();
      if (fetched && fetched.length > 0) {
        setJobs(fetched);
      }
    } catch (e) {
      console.error("Error loading dynamic jobs:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query across title, company, skills, description, category, and location
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title?.toLowerCase().includes(query);
        const matchesCompany = job.company?.toLowerCase().includes(query);
        const matchesLocation = job.location?.toLowerCase().includes(query);
        const matchesCategory = job.category?.toLowerCase().includes(query);
        const matchesSkills = job.skills?.some((s) => s.toLowerCase().includes(query));
        const matchesDesc = job.description?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesCategory && !matchesSkills && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All Drives") {
        if (job.category !== selectedCategory) {
          return false;
        }
      }

      // Work mode filter
      if (selectedWorkMode !== "All Work Modes") {
        if (!job.workMode?.toLowerCase().includes(selectedWorkMode.toLowerCase())) {
          return false;
        }
      }

      // Experience filter
      if (selectedExperience === "Freshers") {
        if (!job.experience?.toLowerCase().includes("fresher")) {
          return false;
        }
      } else if (selectedExperience === "Experienced") {
        if (!job.experience?.toLowerCase().includes("experienced") && !job.experience?.toLowerCase().includes("year") && !job.experience?.toLowerCase().includes("+")) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "salary-high") {
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      }
      if (sortBy === "salary-low") {
        return (a.salaryMin || 0) - (b.salaryMin || 0);
      }
      if (sortBy === "company") {
        return a.company.localeCompare(b.company);
      }
      // default: newest
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
  }, [jobs, searchQuery, selectedCategory, selectedWorkMode, selectedExperience, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Drives");
    setSelectedWorkMode("All Work Modes");
    setSelectedExperience("All Experience");
    setSortBy("newest");
  };

  const isFiltered = Boolean(
    searchQuery ||
    selectedCategory !== "All Drives" ||
    selectedWorkMode !== "All Work Modes" ||
    selectedExperience !== "All Experience"
  );

  return {
    jobs,
    isLoading,
    refreshJobs: loadJobs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedWorkMode,
    setSelectedWorkMode,
    selectedExperience,
    setSelectedExperience,
    sortBy,
    setSortBy,
    filteredJobs,
    totalCount: jobs.length,
    filteredCount: filteredJobs.length,
    clearFilters,
    isFiltered
  };
}
