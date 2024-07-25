import React from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type Props = {
	open: boolean,
	setOpen: (open: boolean) => void,
	close?: () => void,
	children: React.ReactNode
}

const SonarModal = (props: Props) => {
	return (
		<Dialog open={props.open} onOpenChange={props.close ? props.close : () => props.setOpen(false)}>
			<DialogContent className="flex max-w-[560px]">
				<div className='flex flex-row w-full gap-5'>
					{props.children}
				</div>
				<X className='h-4 w-4 absolute right-4 top-4 cursor-pointer text-2xl' onClick={() => props.setOpen(false)} />
			</DialogContent>
		</Dialog>
	)
}

export default SonarModal