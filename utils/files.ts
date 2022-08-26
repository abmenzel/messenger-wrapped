const tryFindImage = (files: File[], imagePath: string): File | null => {
    const imagePathParts = imagePath.split('/')
    const fileName = imagePathParts[imagePathParts.length - 1]
    const match = files.find((img) => img.name == fileName)
    if (match) {
        return match
    } else {
        return null
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

export {getAllFiles, tryFindImage}