import React from 'react';
import AvatarSection from './AvatarSection';
import ContentSection from './ContentSection';
import QuickLanguageSwitcher from '../QuickLanguageSwitcher';
interface HeaderProps {
  name: string;
  title: string;
  location: string;
  email: string;
  links: {
    name: string;
    url: string;
    icon: string;
    displayText: string;
  }[];
}

const Header = ({ name, title, location, email, links }: HeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row print:flex-row relative">
      <AvatarSection name={name} />
      <ContentSection name={name} title={title} email={email} links={links} />
      
      <div className="absolute top-4 right-4 print:hidden">
        <QuickLanguageSwitcher />
      </div>
    </header>
  );
};

export default Header; 