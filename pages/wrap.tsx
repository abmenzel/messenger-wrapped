import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Wrap: NextPage = () => {

  const [threads, setThreads] = useState<any[]>([])

  const getAllFiles = async (directory: FileSystemDirectoryHandle) : Promise<File[]> => {
		try {
			const allFilePromises: Promise<File>[] = []
			const findFiles = async (subdir: FileSystemDirectoryHandle) => {

        for await (const entry of subdir.values()) {
          if(entry.kind === 'file') {
            allFilePromises.push(entry.getFile())
          }else{
            await findFiles(entry)
          }
        }
      }
      await findFiles(directory)
      const allFiles: File[] = await Promise.all(allFilePromises)
      return allFiles
		} catch (err) {
      throw new Error('Error occured while reading directory')
		}
	}

  const openFileSelector = async () => {
    const directory: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker();
    const files = await getAllFiles(directory);
    const jsonFiles = files.filter((file: File) => file.type.includes("json"));
    const threads = await getThreads(jsonFiles)
    const sorted = [...threads.values()].sort((a: any, b: any) => {
      return b.messageCount - a.messageCount
    })
    setThreads(sorted)
  }

  const getThreads = async (files: File[]) => {
    const threads: Map<string, {messageCount?: number, files?: File[], title?: string, messages?: {}[]}> = new Map()
    for await (const file of files) {
      const content = await file.text()
      const json = await JSON.parse(content)
      const path = json.thread_path
      if(!(json.participants?.length > 2) && (!json.messages || !json.title)) return
      console.log(json)
      if(threads.has(path)){
        const prev = threads.get(path)
        threads.set(path, {
          messageCount: prev?.messageCount + json.messages.length,
          files: [file, ...(prev?.files as File[])],
          title: prev?.title,
          messages: [json.messages, ...(prev?.messages as [])]
        })
      }else{
        threads.set(path, {
          messageCount: json.messages.length,
          files: [file],
          title: json.title,
          messages: json.messages
        })
      }
    }
    
    return threads
  }

  const ThreadGrid = (props: any) => {
    const {data} = props

    // TODO:
    // Create thread interface
    // Create message interface
    // Add image of group
    // Sort message timestamps
    // Click group -> Start wrapped for group

    return (
      <div className="grid grid-cols-2 gap-4 content-center">
        {data?.map((thread: any, idx: number) => {
          return (
            <div key={thread.title+idx} className="">
              <p className="text-theme-secondary font-bold text-center break-words">{thread.title}</p>
            </div>
          )
        })}
      </div>
    )
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
        {threads.length > 0 ? (
          <div className="my-6 px-6">
            <ThreadGrid data={threads}/>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="sub-title text-center mt-2">Note that uploaded data will not be stored or shared anywhere.</p>
            <button className="btn-primary my-6" onClick={openFileSelector}>Add data</button>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default Wrap
