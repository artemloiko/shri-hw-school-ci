import React, { useCallback } from 'react';
import Link from '../../base/Link/Link';

import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.replace(/-\w+$/, '');

  const handleLanguageChange = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      i18n.changeLanguage(lang === 'en' ? 'ru' : 'en');
    },
    [lang],
  );

  return (
    <footer className="footer">
      <div className="container footer__container">
        <ul className="footer__nav">
          <li className="footer__nav-item">
            <Link to="/" className="footer__link">
              {t('Support')}
            </Link>
          </li>
          <li className="footer__nav-item">
            <Link to="/" className="footer__link">
              {t('Learning')}
            </Link>
          </li>
          <li className="footer__nav-item">
            <Link to="/" className="footer__link" onClick={handleLanguageChange}>
              {lang === 'en' ? 'Русский язык' : 'English'}
            </Link>
          </li>
        </ul>
        <div className="footer__copy">{t('copyright 2020 Artem Loiko')}</div>
      </div>
    </footer>
  );
};

export default Footer;
