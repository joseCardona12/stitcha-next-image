interface IItemButtonOnboardingProps {
  text: string;
  isActive?: boolean;
}
export default function ItemButtonOnboarding({
  text,
  isActive = false,
}: IItemButtonOnboardingProps) {
  return (
    <button
      className={`${isActive ? "bg-gray-100" : ""} rounded-2xl p-1 pl-4 pr-4`}
    >
      <span className="text-gray-500">{text}</span>
    </button>
  );
}
