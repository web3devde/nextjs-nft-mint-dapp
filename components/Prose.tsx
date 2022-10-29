type Props = {
  children: React.ReactNode;
};

export default function Prose({ children }: Props) {
  return <div className="max-w-prose mx-auto px-8 py-8">

    {children}
    </div>;
}
