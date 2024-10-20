import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";

import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/theme";
import { ChevronDown, Moon, Plus, Search, Share, Sun } from "lucide-react";

import { useFocus } from "@/hooks/use-focus";
import { useRemindersStore } from "@/stores/reminders";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
	component: Home,
});

function ViewSkeleton() {
	return (
		<Skeleton className="w-full rounded-lg p-2 space-y-2">
			<div className="flex justify-between">
				<Skeleton className="size-8 rounded-full" />
				<Skeleton className="h-[22px] w-[16px] " />
			</div>
			<Skeleton className="h-[14px] w-[60px]" />
		</Skeleton>
	);
}

function ListSkeleton() {
	return (
		<div className="w-full flex justify-between items-center">
			<div className="flex gap-2 items-center">
				<Skeleton className="size-8 rounded-full" />
				<Skeleton className="h-[22px] w-[100px]" />
			</div>
			<Skeleton className="h-[22px] w-[16px]" />
		</div>
	);
}

function ReminderSkeleton() {
	return (
		<div className="pl-4 flex gap-2 items-center">
			<Checkbox className="size-6 rounded-full border-border data-[state=checked]:border-primary shadow-none" />
			<div className="w-full">
				<Skeleton className="h-[26px] w-[360px]" />
				<hr className="translate-y-2 w-full" />
			</div>
		</div>
	);
}

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<Sun className="size-6 text-muted-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute size-6 text-muted-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function AddReminderButton() {
	const { addReminder, generateReminderId } = useRemindersStore();

	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={() => {
				addReminder({
					id: generateReminderId(),
					title: "",
					checked: false,
				});
			}}
		>
			<Plus className="size-6 text-muted-foreground" />
		</Button>
	);
}

function ReminderEditorMode({ id }: { id: string }) {
	const { clearEmptyReminders, reminders, updateReminder } =
		useRemindersStore();

	const [hasBeenFocused, setHasBeenFocused] = useState(false);

	const reminder = useMemo(() => reminders.get(id), [reminders, id]);
	if (!reminder) throw new Error("Reminder not found");

	const [title, setTitle] = useState(reminder.title);
	const { ref, setFocus, isFocused } = useFocus<HTMLInputElement>();

	useEffect(() => {
		setFocus();
	}, [setFocus]);

	useEffect(() => {
		if (isFocused) {
			setHasBeenFocused(true);
		}
	}, [isFocused]);

	useEffect(() => {
		if (hasBeenFocused && !isFocused) {
			updateReminder(id, { title });
			clearEmptyReminders();
		}
	}, [
		isFocused,
		clearEmptyReminders,
		updateReminder,
		id,
		title,
		hasBeenFocused,
	]);

	return (
		<div className="pl-4 flex gap-2 items-center">
			<Checkbox className="size-6 rounded-full border-border data-[state=checked]:border-primary shadow-none" />
			<div className="w-full">
				<Input
					ref={ref}
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
					className="w-full border-0 focus-visible:ring-0 h-full p-0"
				/>
				<hr className="translate-y-2 w-full" />
			</div>
		</div>
	);
}

function Reminders() {
	const { reminders } = useRemindersStore();

	const remindersArray = useMemo(
		() => Array.from(reminders.values()),
		[reminders],
	);

	return (
		<>
			{remindersArray.map((reminder) => (
				<ReminderEditorMode id={reminder.id} key={reminder.id} />
			))}
		</>
	);
}

function Home() {
	return (
		<div className="flex min-h-screen">
			<div className="bg-secondary w-[26rem] space-y-4">
				<div className="px-4 pt-4">
					<div className="relative">
						<Input placeholder="Search" className="pl-7" />
						<Search className="size-4 absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground" />
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2 px-4">
					<ViewSkeleton />
					<ViewSkeleton />
					<ViewSkeleton />
					<ViewSkeleton />
				</div>
				<hr />
				<div className="space-y-2 px-4">
					<ListSkeleton />
					<ListSkeleton />
					<ListSkeleton />
					<ListSkeleton />
					<ListSkeleton />
					<div className="w-full space-y-2 pt-2">
						<div className="w-full flex gap-2 items-center">
							<ChevronDown className="size-4 text-muted-foreground" />
							<Skeleton className="h-[22px] w-[90px]" />
						</div>
						<div className="pl-6 space-y-2">
							<ListSkeleton />
							<ListSkeleton />
							<ListSkeleton />
							<ListSkeleton />
						</div>
					</div>
				</div>
			</div>
			<div className="bg-background flex-1 space-y-4">
				<div className="flex justify-end gap-2 pt-4 px-4">
					<ModeToggle />
					<Button size="icon" variant="ghost">
						<Share className="size-6 text-muted-foreground" />
					</Button>
					<AddReminderButton />
				</div>
				<div className="px-4 flex justify-between">
					<Skeleton className="w-[300px] h-[50px]" />
					<Skeleton className="w-[40px] h-[50px]" />
				</div>
				<Reminders />
			</div>
		</div>
	);
}
