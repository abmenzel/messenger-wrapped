import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const Pick: NextPage = () => {

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute("directory", "");
      ref.current.setAttribute("webkitdirectory", "");
    }
  }, [ref]);

  const openFileSelector = () => {
    if (ref.current !== null) {
      ref.current.click();
    }
  }

  const checkFiles = (e:any) => {
    console.log(e.target.files);
  }

  const getAllFiles = async (dir:any) => {
		try {
			let allFiles: any = []
			const findFiles = async (subdir:any) => {
				const files = await fs.promises.readdir(subdir)
				await Promise.all(
					files.map(async (file:any) => {
						const filePath = path.join(subdir, file)
						if (isDirectory(filePath)) {
							await findFiles(filePath)
						} else {
							allFiles.push(filePath)
						}
					})
				)
			}

			await findFiles(dir)

			return allFiles
		} catch (err) {
			console.error('Error occured while reading directory: ', err)
		}
	}


  return (
    <div>
      <Head>
        <title>Messenger Wrapped | Pick messages</title>
        <meta name="description" content="Messenger Wrapped" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen h-full bg-theme-primary">
        <h1 className="big-title text-center">Pick your group</h1>
        <p className="sub-title text-center mt-2">Note that uploaded data will not be stored or shared anywhere.</p>
        <button className="btn-primary my-6" onClick={openFileSelector}>Add data</button>
        <input className="hidden" type="file" onChange={checkFiles} ref={ref} multiple/>
      </div>
    </div>
  )
}

export default Pick
