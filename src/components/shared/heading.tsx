import { tabItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { usePathname } from '@/routes/hooks';
import { Link } from 'react-router-dom';

type THeadingProps = {
  className?: string;
};

export default function Heading({ className }: THeadingProps) {
  const pathname = usePathname();
  console.log(pathname)
  return (
    <div className={className}>
      {tabItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            'min-h-full rounded-none border-b-2 border-b-transparent px-6 py-5 uppercase text-gray500 font-semibold hover:bg-transparent hover:text-white',
            pathname === item.path && 'text-white'
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
