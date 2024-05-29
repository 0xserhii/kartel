import { tabItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { usePathname } from '@/routes/hooks';
import { Link } from 'react-router-dom';

type THeadingProps = {
  className?: string;
};

export default function Heading({ className }: THeadingProps) {
  const pathname = usePathname();
  return (
    <div className={className}>
      {tabItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            'min-h-full rounded-none border-b-2 border-b-transparent px-6 py-5 uppercase text-white font-semibold hover:bg-transparent',
            pathname === item.path && 'text-[#A326D4]'
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
