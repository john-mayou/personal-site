import { SiLinkedin, SiGithub, SiLeetcode } from 'react-icons/si'
import { IconType } from 'react-icons'
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
        <SocialLink href={'https://www.linkedin.com/in/johnmayou/'} icon={SiLinkedin} />
        <SocialLink href={'https://github.com/john-mayou'} icon={SiGithub} />
        <SocialLink href={'https://leetcode.com/u/johnmayou/'} icon={SiLeetcode} />
      </div>
    </nav>
  )
}

function SocialLink({ href, icon: Icon }: { href: string; icon: IconType }) {
  return (
    <Link href={href} className={styles.socialLink}>
      <Icon />
    </Link>
  )
}
