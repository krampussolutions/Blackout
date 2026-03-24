type CategoryCardProps = {
  name: string;
  description: string;
};

export default function CategoryCard({ name, description }: CategoryCardProps) {
  return (
    <div className="card h-full">
      <h3 className="mb-2 text-lg font-semibold">{name}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}
