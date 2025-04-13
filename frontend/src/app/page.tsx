import Health from '@/components/Health'
import Metrics from '@/components/Metrics'
import Navbar from '@/components/Navbar'
import { EditorWrapper } from '@/components/Editor'
import { loadContentFiles } from '@/utils/content'
import styles from './page.module.scss'

export default function Home() {
  const files = loadContentFiles()

  return (
    <div>
      <Metrics />
      <Health />
      <Navbar />
      <main className={styles.main}>
        <EditorWrapper files={files} />
      </main>
    </div>
  )
}
