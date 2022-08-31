import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CARD } from "../styles";

type CardProps = {
  title: string;
  children: React.ReactNode;
  href: string;
  className?: string;
};

const Card = ({ children, title, href, className = "" }: CardProps) => {
  return (
    <div className={`${CARD} w-[300px] h-[200px] text-center ${className}`}>
      <h1 className="text-yellow-500 text-2xl font-semibold">{title}</h1>
      <p>{children}</p>
      <Link href={href}>
        <a>
          <AiOutlineArrowRight className="w-7 h-7" />
        </a>
      </Link>
    </div>
  );
};

export default Card;
