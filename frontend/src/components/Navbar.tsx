'use client'
import { SiLinkedin, SiGithub, SiLeetcode } from 'react-icons/si'
import { IconType } from 'react-icons'
import { trackMetric } from '@/utils/metrics'
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
        <SocialLink
          href={'https://www.linkedin.com/in/johnmayou/'}
          platform={'linkedin'}
          icon={SiLinkedin}
        />
        <SocialLink href={'https://github.com/john-mayou'} platform={'github'} icon={SiGithub} />
        <SocialLink
          href={'https://leetcode.com/u/johnmayou/'}
          platform={'leetcode'}
          icon={SiLeetcode}
        />
      </div>
    </nav>
  )
}

function SocialLink({
  href,
  platform,
  icon: Icon,
}: {
  href: string
  platform: string
  icon: IconType
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className={styles.socialLink}
      onClick={() => trackMetric({ name: 'social_click_total', count: 1, labels: { platform } })}
    >
      <Icon />
    </Link>
  )
}
