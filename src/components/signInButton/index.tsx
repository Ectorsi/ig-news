import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  return (
    <button className={styles.signInButton}>
      <FaGithub color={isUserLoggedIn ? '#04d361' : '#eba417'} />
      Sign in with Github
      <FiX color='#737380' className={styles.closeIcon} />
    </button>
  )
}