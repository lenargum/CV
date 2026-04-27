import React from 'react';
import AvatarSection from './AvatarSection';
import ContentSection from './ContentSection';
import { ProfileSwitcher } from '../QuickLanguageSwitcher';
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
    <header className="cv-header relative px-4 pt-4 pb-4 md:px-9 md:pt-9 md:pb-7 print:p-0">
      <div className="flex flex-row gap-5 md:gap-6 items-start md:items-stretch">
        <AvatarSection name={name} />
        <ContentSection
          name={name}
          title={title}
          email={email}
          links={links}
          profile={profile}
          profileSwitcher={<ProfileSwitcher activeProfile={profile} />}
        />
      </div>
    </header>
  );
};

export default Header;
