import { useState } from "react";
import Navbar from "../components/Navbar";
import ServiceFilters from "../components/services/ServiceFilters";
import ServiceGrid from "../components/services/ServiceGrid";
import useServices from "../hooks/useServices";

const ServicesPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    price: "",
    duration: "",
    sort: "name",
    availableOnly: false,
  });

  const { services, loading } = useServices(filters);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ServiceFilters
          {...filters}
          setSearch={(v) => setFilters({ ...filters, search: v })}
          setPrice={(v) => setFilters({ ...filters, price: v })}
          setDuration={(v) => setFilters({ ...filters, duration: v })}
          setSort={(v) => setFilters({ ...filters, sort: v })}
          setAvailableOnly={(v) =>
            setFilters({ ...filters, availableOnly: v })
          }
          onClear={() =>
            setFilters({
              search: "",
              price: "",
              duration: "",
              sort: "name",
              availableOnly: false,
            })
          }
        />

        <ServiceGrid services={services} loading={loading} />
      </div>
    </>
  );
};

export default ServicesPage;
