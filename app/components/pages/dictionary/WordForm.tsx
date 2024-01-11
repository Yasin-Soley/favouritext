import { Form, Link, useSubmit } from '@remix-run/react'
import { useRef, useState, type FormEvent } from 'react'

import {
	PlusCircleIcon,
	PlusIcon,
	XCircleIcon,
} from '@heroicons/react/24/solid'

export default function WordForm() {
	const [word, setWord] = useState('')
	const [meanings, setMeanings] = useState<string[]>([])
	const [meaningInput, setMeaningInput] = useState('')
	const [definitions, setDefinitions] = useState([''])
	const [examples, setExamples] = useState([''])
	const [appearances, setAppearances] = useState([''])

	const meanInputRef = useRef<HTMLInputElement>(null)
	const submit = useSubmit()

	const handleWordChange = (word: string) => setWord(word)

	const deleteMeaning = (index: number) => {
		const newMeanings = [...meanings]
		newMeanings.splice(index, 1)
		setMeanings(newMeanings)
	}

	const handleMeanInputChange = (value: string) => setMeaningInput(value)
	const handleMeanInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Enter') {
			e.preventDefault()

			addMeaning()
		}
	}
	const addMeaning = () => {
		let meaningExists = meanings.includes(meaningInput)
		if (meaningInput.trim() !== '' && !meaningExists) {
			setMeanings((prevMeans) => [...prevMeans, meaningInput.trim()])
			setMeaningInput('')
			meanInputRef.current?.focus() // Focus the tagInput
		}
	}

	// shared input for `definitions` & `examples`
	const handleSharedInputChange = (
		type: string,
		i: number,
		value: string
	) => {
		if (type === 'def') {
			let defs = [...definitions]
			defs[i] = value
			setDefinitions(defs)
		} else if (type === 'exam') {
			let exams = [...examples]
			exams[i] = value
			setExamples(exams)
		} else {
			let newApps = [...appearances]
			newApps[i] = value
			setAppearances(newApps)
		}
	}

	const addDefLine = () => setDefinitions((prevState) => [...prevState, ''])
	const addExampleLine = () => setExamples((prevState) => [...prevState, ''])
	const addAppearanceLine = () =>
		setAppearances((prevState) => [...prevState, ''])

	const deleteLineShared = (index: number, type: string) => {
		if (type === 'def') {
			let newLines = [...definitions]
			newLines.splice(index, 1)
			setDefinitions(newLines)
		} else if (type === 'exam') {
			let newLines = [...examples]
			newLines.splice(index, 1)
			setExamples(newLines)
		} else {
			let newLines = [...appearances]
			newLines.splice(index, 1)
			setAppearances(newLines)
		}
	}

	const handleSubmitWord = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('word', word)
		formData.append('meanings', meanings.join(','))
		formData.append('definitions', definitions.join(','))
		formData.append('examples', examples.join(','))
		formData.append('appearances', appearances.join(','))

		submit(formData, { method: 'POST' })
		// submit(formData, {
		// 	method: poem ? 'PUT' : 'POST',
		// 	action: poem ? `/poem/${poem.id}` : `/poem/add`,
		// })
	}

	return (
		<div className="w-3/5 flex flex-col" dir="ltr">
			<Form
				method="POST"
				className="rounded-sm overflow-hidden drop-shadow-md"
				onSubmit={handleSubmitWord}
			>
				<div className="py-4 px-6 flex bg-green_dark text-primary">
					<input
						className={`mr-auto outline-none bg-transparent placeholder:text-primary border-b border-primary pb-1 w-1/4`}
						type="text"
						placeholder="word"
						value={word}
						onChange={(e) => handleWordChange(e.target.value)}
					/>

					{meanings.length > 0 && (
						<p className="flex gap-x-1 text-sm">
							{meanings.map((meaning, index) => (
								<span
									key={index}
									className="px-4 py-0.5 rounded-sm bg-primary text-green_dark"
								>
									{meaning}
									<button
										type="button"
										onClick={() => deleteMeaning(index)}
										className="mr-1 text-red-500"
									>
										<XCircleIcon className="w-4" />
									</button>
								</span>
							))}
						</p>
					)}

					<div className="w-1/6 relative ml-5">
						<input
							dir="rtl"
							className={`outline-none bg-transparent placeholder:text-primary  placeholder:text-sm border-b border-primary pb-1 w-full`}
							type="text"
							placeholder="معنی‌(ها)"
							value={meaningInput}
							onChange={(e) =>
								handleMeanInputChange(e.target.value)
							}
							onKeyDown={handleMeanInputKeyDown}
							ref={meanInputRef}
						/>
						<button
							type="button"
							onClick={addMeaning}
							className="text-primary absolute left-0 top-1/2 transform -translate-y-1/2"
						>
							<PlusCircleIcon className="w-5" />
						</button>
					</div>
				</div>

				<div className="px-6 py-10 bg-green_light flex flex-col">
					<div>
						<h3 className="flex items-center gap-x-4 font-bold text-lg mb-4">
							<button
								type="button"
								onClick={addDefLine}
								className="font-normal flex gap-x-2 items-center bg-green_dark text-primary py-2 px-4 rounded-sm text-xs"
							>
								<PlusIcon className="font-bold w-4 rounded-full text-green_dark bg-primary" />
								<span className="">add</span>
							</button>
							Definition:
						</h3>

						{definitions.map((def, index) => (
							<div className="w-3/4 ml-24 relative" key={index}>
								<input
									key={index}
									type="text"
									value={def}
									onChange={(e) =>
										handleSharedInputChange(
											'def',
											index,
											e.target.value
										)
									}
									placeholder={`${
										index + 1
									}. type your definition here`}
									className={`outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm border-b border-green_dark text-green_dark pb-1 flex-1 w-full mb-2`}
								/>
								<button
									type="button"
									className="absolute right-0"
									onClick={deleteLineShared.bind(
										null,
										index,
										'def'
									)}
								>
									<XCircleIcon className="w-4 text-red-400" />
								</button>
							</div>
						))}
					</div>

					<div className="my-8">
						<h3 className="flex items-center gap-x-4 font-bold text-lg mb-4">
							<button
								type="button"
								onClick={addExampleLine}
								className="font-normal flex gap-x-2 items-center bg-green_dark text-primary py-2 px-4 rounded-sm text-xs"
							>
								<PlusIcon className="font-bold w-4 rounded-full text-green_dark bg-primary" />
								<span className="">add</span>
							</button>
							Example(s):
						</h3>

						{examples.map((example, index) => (
							<div className="w-3/4 ml-24 relative" key={index}>
								<input
									type="text"
									value={example}
									onChange={(e) =>
										handleSharedInputChange(
											'exam',
											index,
											e.target.value
										)
									}
									placeholder={`${
										index + 1
									}. type your example here`}
									className={`outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm border-b border-green_dark text-green_dark pb-1 flex-1  w-full mb-2`}
								/>
								<button
									type="button"
									className="absolute right-0"
									onClick={deleteLineShared.bind(
										null,
										index,
										'exam'
									)}
								>
									<XCircleIcon className="w-4 text-red-400" />
								</button>
							</div>
						))}
					</div>

					<div>
						<h3 className="flex items-center gap-x-4 font-bold text-lg mb-4">
							<button
								type="button"
								onClick={addAppearanceLine}
								className="font-normal flex gap-x-2 items-center bg-green_dark text-primary py-2 px-4 rounded-sm text-xs"
							>
								<PlusIcon className="font-bold w-4 rounded-full text-green_dark bg-primary" />
								<span className="">add</span>
							</button>
							Where have I seen?
						</h3>

						{appearances.map((appearance, index) => (
							<div className="w-3/4 ml-24 relative" key={index}>
								<input
									type="text"
									value={appearance}
									onChange={(e) =>
										handleSharedInputChange(
											'appearance',
											index,
											e.target.value
										)
									}
									placeholder={`${
										index + 1
									}. type where you see the word `}
									className={`outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm border-b border-green_dark text-green_dark pb-1 flex-1  w-full mb-2`}
								/>
								<button
									type="button"
									className="absolute right-0"
									onClick={deleteLineShared.bind(
										null,
										index,
										'appearance'
									)}
								>
									<XCircleIcon className="w-4 text-red-400" />
								</button>
							</div>
						))}
					</div>

					<div className="mt-10 flex flex-col gap-y-3 items-center">
						<button
							type="submit"
							className="bg-green_dark text-primary w-44 py-2 rounded-sm"
						>
							تایید
						</button>
						<Link
							className="text-xs pb-1 border-b border-green_dark"
							to={`/dictionary`}
						>
							بازگشت به دیکشنری
						</Link>
					</div>
				</div>
			</Form>
		</div>
	)
}
