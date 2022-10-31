type TextElementProps = { children: React.ReactNode };

export const Paragraph = ({ children }: TextElementProps) => (
  <p className="text-xl my-2">{children}</p>
);

export const H = ({ children }: TextElementProps) => (
  <span className="text-yellow-500 font-bold">{children}</span>
);
