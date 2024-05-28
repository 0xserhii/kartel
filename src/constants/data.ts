import { HistoryItemProps } from '@/components/shared/live-chat';
import { NavItemGroup } from '@/types';

export const navItems: NavItemGroup[] = [
  {
    title: 'Casino',
    items: [
      {
        title: 'Crash',
        href: '/crash',
        icon: "/src/assets/icons/crash.svg",
        label: 'Crash'
      },
      {
        title: 'Coin Flip',
        href: '/coin-flip',
        icon: "/src/assets/icons/coins.svg",
        label: 'coin flip'
      },
      {
        title: 'Mines',
        href: '/mines',
        icon: "/src/assets/icons/mines.svg",
        label: 'mines'
      }
    ]
  },
  {
    title: 'Mini games',
    items: [
      {
        title: 'Slots',
        href: '/slots',
        icon: "/src/assets/icons/slots.svg",
        label: 'slots'
      },
      {
        title: 'Black Jack',
        href: '/black-jack',
        icon: "/src/assets/icons/blackjack.svg",
        label: 'coin flip'
      },
      {
        title: 'Roulette',
        href: '/roulette',
        icon: "/src/assets/icons/roulette.svg",
        label: 'roulette'
      },
      {
        title: 'Horse Racing Game',
        href: '/hourse-racing',
        icon: "/src/assets/icons/horserace.svg",
        label: 'horse racing game'
      }
    ]
  },
  {
    title: 'Others',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: "/src/assets/icons/setting.svg",
        label: 'settings'
      },
      {
        title: 'Help & Support',
        href: '/help-support',
        icon: "/src/assets/icons/setting.svg",
        label: 'Help & Support'
      }
    ]
  }
];

export const tabItems = ['home', 'leader board', 'dashboard'];

export const chatsMock: HistoryItemProps[] = [
  {
    name: 'John Doe',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '02:05'
  },
  {
    name: 'Alice Johnson',
    message:
      'I came across your profile and I would like to know more about your services.',
    avatar: 'src/assets/avatar-mock.png',
    time: '05:18'
  },
  {
    name: 'David Smith',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '23:45'
  },
  {
    name: 'Emma Wilson',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '02:05'
  },
  {
    name: 'James Brown',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '05:18'
  },
  {
    name: 'Laura White',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '23:45'
  },
  {
    name: 'Michael Lee',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '02:05'
  },
  {
    name: 'Olivia Green',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '05:18'
  },
  {
    name: 'Robert Taylor',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '23:45'
  },
  {
    name: 'John Doe',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '02:05'
  },
  {
    name: 'Alice Johnson',
    message:
      'I came across your profile and I would like to know more about your services.',
    avatar: 'src/assets/avatar-mock.png',
    time: '05:18'
  },
  {
    name: 'David Smith',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '23:45'
  },
  {
    name: 'Emma Wilson',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '02:05'
  },
  {
    name: 'James Brown',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '05:18'
  },
  {
    name: 'Laura White',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '23:45'
  },
  {
    name: 'Michael Lee',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '02:05'
  },
  {
    name: 'Olivia Green',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '05:18'
  },
  {
    name: 'Robert Taylor',
    message: 'Hello, how can I help you today?',
    avatar: 'src/assets/avatar-mock.png',
    time: '23:45'
  }
];

export const scores = [
  {
    rank: 1,
    name: 'Kristin Watson',
    avatar: 'src/assets/avatar-mock.png',
    score: 2373,
    betAmount: 183,
    time: '12:00:23'
  },
  {
    rank: 2,
    name: 'Alice Johnson',
    avatar: 'src/assets/avatar-mock.png',
    score: 2373,
    betAmount: 183,
    time: '12:00:23'
  },
  {
    rank: 3,
    name: 'David Smith',
    avatar: 'src/assets/avatar-mock.png',
    score: 2373,
    betAmount: 183,
    time: '12:00:23'
  },
  {
    rank: 4,
    name: 'Emma Wilson',
    avatar: 'src/assets/avatar-mock.png',
    score: 2373,
    betAmount: 183,
    time: '12:00:23'
  },
  {
    rank: 5,
    name: 'James Brown',
    avatar: 'src/assets/avatar-mock.png',
    score: 2373,
    betAmount: 183,
    time: '12:00:23'
  }
];

export const users = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    time: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    time: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    time: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    time: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    time: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    time: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    time: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    time: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    time: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    time: 'Active'
  }
];

export const dashboardCard = [
  {
    date: 'Today',
    total: 2000,
    role: 'Students',
    color: 'bg-[#EC4D61] bg-opacity-40'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Teachers',
    color: 'bg-[#FFEB95] bg-opacity-100'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Parents',
    color: 'bg-[#84BD47] bg-opacity-30'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Schools',
    color: 'bg-[#D289FF] bg-opacity-30'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};
