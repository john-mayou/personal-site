import Health from '@/components/Health'
import Metrics from '@/components/Metrics'
import Navbar from '@/components/Navbar'
import { EditorWrapper } from '@/components/Editor'
import { loadAllContentFiles } from '@/utils/content'
import styles from './page.module.scss'

export default async function Home() {
  const files = await loadAllContentFiles()

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
