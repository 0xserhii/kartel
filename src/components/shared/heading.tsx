import { tabItems } from '@/constants/data';
import { Button } from '../ui/button';
import { useTab } from '@/providers/tab-provider';
import { cn } from '@/lib/utils';

type THeadingProps = {
  className?: string;
};

export default function Heading({ className }: THeadingProps) {
  const { tab, setTab } = useTab();
  return (
    <div className={className}>
      {tabItems.map((item) => (
        <Button
          key={item}
          variant={'ghost'}
          className={cn(
            'min-h-full rounded-none border-b-2 border-b-transparent px-6 py-5 uppercase text-gray500 font-semibold hover:bg-transparent hover:text-purple',
            tab === item && 'border-b-purple text-purple'
          )}
          onClick={() => setTab(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
