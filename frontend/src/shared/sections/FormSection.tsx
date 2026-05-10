type Props = {
  title?: string;

  children: React.ReactNode;
};

export function FormSection({
  title,

  children,
}: Props) {
  return (
    <section className="space-y-5">
      {title && (
        <div>
          <h3
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.18em]
              text-foreground
            "
          >
            {title}
          </h3>
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </section>
  );
}
