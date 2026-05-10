type Props = {
  type?: "error" | "warning" | "success";

  children: React.ReactNode;
};

export function AlertBox({
  type = "error",

  children,
}: Props) {
  const styles = {
    error: `
      border-red-500/20
      bg-red-500/10
      text-red-300
    `,

    warning: `
      border-yellow-500/20
      bg-yellow-500/10
      text-yellow-200
    `,

    success: `
      border-[#39FF14]/20
      bg-[#39FF14]/10
      text-[#b8ffab]
    `,
  };

  return (
    <div
      className={`
        rounded-2xl

        border

        px-4
        py-3

        text-sm

        backdrop-blur-xl

        ${styles[type]}
      `}
    >
      {children}
    </div>
  );
}
