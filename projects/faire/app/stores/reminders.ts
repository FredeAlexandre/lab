import { z } from "zod";
import { create } from "zustand";

export const ReminderSchema = z.object({
	id: z.string(),
	title: z.string(),
	checked: z.boolean(),
});

export type Reminder = z.infer<typeof ReminderSchema>;

interface RemindersState {
	reminders: Map<Reminder["id"], Reminder>;
	generateReminderId: () => string;
	addReminder: (reminder: Reminder) => void;
	updateReminder: (id: string, reminder: Partial<Reminder>) => void;
	clearEmptyReminders: () => void;
}

const MAX_TRIES = 100;

function deepMerge<T>(target: T, source: Partial<T>): T {
	const result = { ...target };
	for (const key in source) {
		const targetValue = target[key];
		const sourceValue = source[key];
		if (typeof targetValue === "object" && typeof sourceValue === "object") {
			result[key] = deepMerge(targetValue, sourceValue);
		} else {
			// @ts-ignore
			result[key] = sourceValue;
		}
	}
	return result;
}

export const useRemindersStore = create<RemindersState>()((set, get) => ({
	reminders: new Map(),
	generateReminderId: () => {
		let tries = 0;
		while (tries < MAX_TRIES) {
			const newId = Math.random().toString();
			const ids = Array.from(get().reminders.keys());
			if (ids.every((id) => id !== newId)) {
				return newId;
			}
			tries++;
		}
		throw new Error("Failed to generate unique reminder ID");
	},
	addReminder: (reminder) =>
		set((state) => ({
			reminders: new Map(state.reminders.set(reminder.id, reminder)),
		})),
	updateReminder: (id, reminder) =>
		set((state) => {
			const actualReminder = state.reminders.get(id);
			if (!actualReminder) throw new Error("Reminder not found");
			const newReminder = deepMerge(actualReminder, reminder);

			const reminders = new Map(state.reminders);
			reminders.set(id, newReminder);

			return { reminders };
		}),
	clearEmptyReminders: () =>
		set((state) => {
			const values = Array.from(state.reminders.values());
			const keepedReminders = values.filter(
				(reminder) => reminder.title !== "",
			);
			const reminders = new Map(
				keepedReminders.map((reminder) => [reminder.id, reminder]),
			);

			return {
				reminders,
			};
		}),
}));
