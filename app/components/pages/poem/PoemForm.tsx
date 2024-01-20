import { useRef, useState, type FormEvent } from 'react'
import {
	Form,
	Link,
	useActionData,
	useNavigation,
	useSubmit,
} from '@remix-run/react'

import { PlusIcon, XCircleIcon } from '@heroicons/react/24/solid'
import type { PoemLine } from '@/data/validate.server'
import type { action } from '@/routes/_app.poem_.add'
import Button from '@/components/common/Button'

interface PoemFormProps {
	poem?: {
		id: string
		poet: string
		alias: string
		tags: string[]
		lines: {
			id: string
			p1: string
			p2: string
			poemId: string
		}[]
	}
}

export default function PoemForm({ poem }: PoemFormProps) {
	let defaultValues
	if (poem) {
		defaultValues = {
			poet: poem.poet,
			alias: poem.alias,
			tags: poem.tags,
			lines: poem.lines,
		}
	} else {
		defaultValues = {
			poet: '',
			alias: '',
			tags: [],
			lines: [{ p1: '', p2: '' }],
		}
	}

	const [poet, setPoet] = useState(defaultValues.poet)
	const [poemName, setPoemName] = useState(defaultValues.alias)
	const [lines, setLines] = useState<PoemLine[]>(defaultValues.lines)
	const [tags, setTags] = useState<string[]>(defaultValues.tags)
	const [tagInput, setTagInput] = useState('')

	const tagInputRef = useRef<HTMLInputElement>(null)

	const validationErrors = useActionData<typeof action>()
	const submit = useSubmit()

	const navigation = useNavigation()

	const handlePoetChange = (poet: string) => {
		setPoet(poet)
	}

	const handlePoemNameChange = (poemName: string) => {
		setPoemName(poemName)
	}

	const addLine = () => {
		// Add a new line to the state
		setLines([...lines, { p1: '', p2: '' }])
	}

	const removeLine = (index: number) => {
		const newLines = [...lines]
		newLines.splice(index, 1)
		setLines(newLines)
	}

	const handleInputChange = (
		index: number,
		part: 'p1' | 'p2',
		value: string
	) => {
		// Create a copy of the lines array to avoid directly mutating state
		const newLines = [...lines]

		// Update the specific part of the specified line
		newLines[index][part] = value

		// Update the state with the new array
		setLines(newLines)
	}

	const handleTagInputChange = (value: string) => {
		setTagInput(value)
	}

	const addTag = () => {
		if (tagInput.trim() !== '') {
			setTags((prevTags) => [...prevTags, tagInput.trim()])
			setTagInput('')
			tagInputRef.current?.focus() // Focus the tagInput
		}
	}

	const deleteTag = (index: number) => {
		const newTags = [...tags]
		newTags.splice(index, 1)
		setTags(newTags)
	}

	const handleTagInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			addTag()
		}
	}

	const handleSubmitPoem = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// xxxx aaaa
		// yyyy dddd
		// =>
		// aaaa,xxxx/yyyy,dddd/...
		const mergedPairs = lines.map((line) => line.p1 + ',' + line.p2)
		const poemAsString = mergedPairs.join('/')

		const tagsAsString = tags.join(',')

		const formData = new FormData()
		formData.append('poet', poet)
		formData.append('alias', poemName)
		formData.append('tags', tagsAsString)
		formData.append('lines', poemAsString)

		// submit(formData, { method: 'POST' })
		submit(formData, {
			method: poem ? 'PUT' : 'POST',
			action: poem ? `/poem/${poem.id}` : `/poem/add`,
		})
	}

	return (
		<div className="w-3/5 flex flex-col">
			<Form
				method="POST"
				className="rounded-sm overflow-hidden drop-shadow-md"
				onSubmit={handleSubmitPoem}
			>
				<div className="py-4 px-6 flex justify-between bg-green_dark text-primary">
					<input
						className={`outline-none bg-transparent placeholder:text-primary placeholder:text-sm border-b border-primary pb-1 w-3/6 ${
							validationErrors?.alias &&
							'border-red-600 border-b-2'
						}`}
						type="text"
						placeholder="نام شعر"
						value={poemName}
						onChange={(e) => handlePoemNameChange(e.target.value)}
					/>
					<input
						className={`outline-none bg-transparent placeholder:text-primary placeholder:text-sm border-b border-primary pb-1 w-2/6 ${
							validationErrors?.poet &&
							'border-red-600 border-b-2'
						}`}
						type="text"
						placeholder="نام شاعر"
						value={poet}
						onChange={(e) => handlePoetChange(e.target.value)}
					/>
				</div>

				<div className="p-6 bg-green_light flex flex-col">
					<h3 className="flex gap-x-4 font-bold">
						<button
							type="button"
							onClick={addLine}
							className="font-normal flex gap-x-2 items-center bg-green_dark text-primary py-1 px-2 rounded-sm text-xs"
						>
							<PlusIcon className="font-bold w-4 h-4 rounded-full text-green_dark bg-primary" />
							<span className="border-b">افزودن</span>
						</button>
						متن شعر:
					</h3>
					<div className="flex justify-center items-center my-6">
						<ul className="text-sm w-full">
							{lines.map((line, index) => (
								<div
									key={index}
									className={`flex gap-x-8 ${
										index !== 0 && 'mt-4'
									}`}
								>
									<input
										type="text"
										value={line.p1}
										onChange={(e) =>
											handleInputChange(
												index,
												'p1',
												e.target.value
											)
										}
										placeholder="مصرع اول"
										className={`outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm border-b border-green_dark text-green_dark pb-1 flex-1 ${
											validationErrors?.lines
												?.lineNumber === index &&
											validationErrors?.lines?.part ===
												'p1' &&
											'border-red-600 border-b-2 placeholder:text-red-600'
										}`}
									/>
									<div className="w-4 mx-2">
										{index !== 0 && (
											<button
												type="button"
												onClick={removeLine.bind(
													null,
													index
												)}
											>
												<XCircleIcon className="w-4" />
											</button>
										)}
									</div>
									<input
										type="text"
										value={line.p2}
										onChange={(e) =>
											handleInputChange(
												index,
												'p2',
												e.target.value
											)
										}
										placeholder="مصرع دوم"
										className={`outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm border-b border-green_dark text-green_dark pb-1 flex-1 ${
											validationErrors?.lines
												?.lineNumber === index &&
											validationErrors?.lines?.part ===
												'p2' &&
											'border-red-600 border-b-2 placeholder:text-red-600'
										}`}
									/>
								</div>
							))}
						</ul>
					</div>
					<div className="pb-2 py-4">
						<div className="flex gap-x-2 items-center">
							<h3 className="flex gap-x-4 font-bold">
								<button
									type="button"
									onClick={addTag}
									className="font-normal flex gap-x-2 items-center bg-green_dark text-primary py-1 px-2 rounded-sm text-xs"
								>
									<PlusIcon className="font-bold w-4 h-4 rounded-full text-green_dark bg-primary" />
									<span className="border-b">افزودن</span>
								</button>
								برچسب‌ها:
							</h3>

							<input
								type="text"
								value={tagInput}
								onChange={(e) =>
									handleTagInputChange(e.target.value)
								}
								placeholder="نام برچسب"
								onKeyDown={handleTagInputKeyDown}
								ref={tagInputRef}
								className={`outline-none bg-transparent placeholder:text-green_dark placeholder:text-xs border-b border-green_dark mr-4 ${
									validationErrors?.tags &&
									'border-red-600 border-b-2'
								}`}
							/>
						</div>
						<p className="mt-4 flex gap-x-2  text-green_dark text-sm">
							{tags.map((tag, index) => (
								<span
									key={index}
									className="px-2 py-0.5 rounded-sm bg-green_dark text-primary"
								>
									{tag}
									<button
										type="button"
										onClick={() => deleteTag(index)}
										className="mr-1"
									>
										<XCircleIcon className="w-4" />
									</button>
								</span>
							))}
						</p>
					</div>

					{validationErrors && (
						<ul className="my-2">
							{Object.values(validationErrors).map((error, i) => (
								<li
									className="text-red-600 text-sm before:w-3 before:rounded-full"
									key={i}
								>
									{typeof error === 'string' && error}
								</li>
							))}
						</ul>
					)}

					<div className="mt-10 flex flex-col gap-y-3 items-center">
						<Button
							isButton
							type="submit"
							className="bg-green_dark text-primary w-44 py-2 rounded-sm"
							isLoading={navigation.state !== 'idle'}
						>
							تایید
						</Button>
						<Link
							className="text-xs pb-1 border-b border-green_dark"
							to={`/poem`}
						>
							بازگشت به شعر
						</Link>
					</div>
				</div>
			</Form>
		</div>
	)
}
