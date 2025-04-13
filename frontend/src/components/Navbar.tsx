import { SiLinkedin, SiGithub, SiLeetcode } from 'react-icons/si'
import styles from './Navbar.module.scss'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link href="/">
          <Image
            className={styles.titleIcon}
            alt="retro computer"
            src="/retro-computer.png"
            width={20}
            height={20}
            priority
          />
          <span className={styles.titleText}>john.dev</span>
        </Link>
      </div>
      <div className={styles.right}>
        <Link href="https://www.linkedin.com/in/johnmayou/" className={styles.socialLink}>
          <SiLinkedin />
        </Link>
        <Link href="https://github.com/john-mayou" className={styles.socialLink}>
          <SiGithub />
        </Link>
        <Link href="https://leetcode.com/u/johnmayou/" className={styles.socialLink}>
          <SiLeetcode />
        </Link>
      </div>
    </nav>
  )
}
