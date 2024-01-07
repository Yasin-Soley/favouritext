interface FormControlProps {
	label: string
	id: string
	type: string
	autoComplete: string
	name: string
}

export default function FormControl({
	label,
	id,
	type,
	autoComplete,
	name,
}: FormControlProps) {
	return (
		<div className="relative">
			<label
				className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs opacity-70"
				htmlFor={id}
			>
				{label}
			</label>
			<input
				dir="ltr"
				className="w-full rounded-sm outline-none border-none px-4 py-2"
				id={id}
				required
				name={name}
				type={type}
				autoComplete={autoComplete}
			/>
		</div>
	)
}
