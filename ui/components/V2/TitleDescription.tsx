interface ITitleDescriptionProps {
  title: string;
  description: string;
}
export default function TitleDescription({
  title,
  description,
}: ITitleDescriptionProps) {
  return (
    <div className="flex items-center gap-2 justify-center flex-col">
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-gray-500 text-xl">{description}</p>
    </div>
  );
}
