<<<<<<< Updated upstream
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
=======
export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
>>>>>>> Stashed changes
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
    </div>
  );
<<<<<<< Updated upstream
};

export default layout;
=======
}
>>>>>>> Stashed changes
