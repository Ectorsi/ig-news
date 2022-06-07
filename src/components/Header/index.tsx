import styles from './styles.module.scss';
import { SignInButton } from '../signInButton/index';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news logo" />
        <nav>
          <a className={styles.active} href="">Home</a>
          <a href="">Posts</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}