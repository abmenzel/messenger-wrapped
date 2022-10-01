import Label from "./Label"
import Progressbar from "./Progressbar"

const Upload = (props: any) => {
    const {uploadStatus, openFileSelector, abortedUpload} = props

	const text = uploadStatus.suffix ? `${uploadStatus.message} ${uploadStatus.suffix}` : uploadStatus.message

	return (
		<div className='flex flex-col items-center'>
			<Label className='mb-2'>Step 1</Label>
			<h1 className='big-title text-center'>Upload data</h1>
			<div className='flex flex-col items-center justify-center'>
				<p className='sub-title text-center mt-2'>
					Note that uploaded data will not be stored or shared
					anywhere.
				</p>
				{uploadStatus.step == 0 ? (
					<button
						className='btn-primary my-6'
						onClick={openFileSelector}>
						{abortedUpload ? 'Please add data' : 'Add data'}
					</button>
				) : (
					<div>
						<Progressbar
							max={4}
							step={uploadStatus.step}
							className='mt-4 w-48'
							text={text}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default Upload
