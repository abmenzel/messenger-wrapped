const tryFindFiles = (fileMap: Map<string, File>, paths: string[]) : (File | undefined)[] => {
    const files = paths.reduce((acc: (File | undefined)[], path: string) => {
        acc.push(tryFindFile(fileMap, path))
        return acc
    },[])
    return files
}

const tryFindFile = (fileMap: Map<string, File>, path: string) : File | undefined => {
    const pathParts = path.split('/')
    const fileName = pathParts[pathParts.length - 1]
    if(fileMap.has(fileName)){
        return fileMap.get(fileName)
    }else{
        return undefined
    }
}

const getAllFiles = async (
    directory: FileSystemDirectoryHandle
): Promise<File[]> => {
    try {
        const allFilePromises: Promise<File>[] = []
        const findFiles = async (subdir: FileSystemDirectoryHandle) => {
            for await (const entry of subdir.values()) {
                if (entry.kind === 'file') {
                    allFilePromises.push(entry.getFile())
                } else {
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

const nameToFile = (acc: Map<string, File>, image: File) => {
    acc.set(image.name, image)
    return acc
}

export {getAllFiles, tryFindFile, tryFindFiles, nameToFile}