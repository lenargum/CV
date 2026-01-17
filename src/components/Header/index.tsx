import React from 'react';
import AvatarSection from './AvatarSection';
import ContentSection from './ContentSection';
import QuickLanguageSwitcher from '../QuickLanguageSwitcher';
import type { ProfileType } from '../../lib/types';

interface HeaderProps {
  name: string;
  title: string;
  email: string;
  links: {
    name: string;
    url: string;
    icon: string;
    displayText: string;
  }[];
  profile?: ProfileType;
}

const Header = ({ name, title, email, links, profile = 'all' }: HeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row print:flex-row print:items-center relative">
      <AvatarSection name={name} />
      <ContentSection name={name} title={title} email={email} links={links} profile={profile} />
      
      <div className="absolute top-[10px] md:top-4 right-[10px] md:right-4 print:hidden">
        <QuickLanguageSwitcher profile={profile} />
      </div>
    </header>
  );
};

export default Header;
