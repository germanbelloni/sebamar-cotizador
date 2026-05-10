type Props = {
  children: React.ReactNode;
};

export function FormFooter({ children }: Props) {
  return (
    <div
      className="
        pt-4

        border-t border-white/10
      "
    >
      <div className="space-y-4">{children}</div>
    </div>
  );
}
