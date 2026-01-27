import ServiceCard from "./ServiceCard";

const ServiceGrid = ({ services, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-pink-500 rounded-full mx-auto" />
      </div>
    );
  }

  if (!services.length) {
    return <p className="text-center text-gray-500">No services found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <ServiceCard key={s._id} service={s} />
      ))}
    </div>
  );
};

export default ServiceGrid;
