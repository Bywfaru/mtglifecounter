/**
 * Format the room code by removing non-alphanumeric characters,
 * converting to uppercase, and adding a hyphen after the first 3 characters.
 * @param value - The room code string to format.
 * @return Returns the formatted room code in the format XXX-XXX.
 */
export const formatRoomCode = (value: string) => {
	const cleaned = value
		.replace(/[^a-zA-Z0-9]/g, '')
		.toUpperCase()
		.slice(0, 6);

	if (cleaned.length <= 3) return cleaned;

	return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
};

/**
 * Unformat the room code by removing non-alphanumeric characters,
 * @param value - The formatted room code string.
 * @return Returns the unformatted room code, ensuring it is 6 characters long.
 */
export const unformatRoomCode = (value: string) => {
	return value
		.replace(/[^a-zA-Z0-9]/g, '')
		.toUpperCase()
		.slice(0, 6);
};

/**
 * Check if the room code is valid.
 * @param value - The room code string to validate.
 * @return Returns true if the room code is valid, false otherwise.
 */
export const isValidRoomCode = (value: string) => {
	return /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(value);
};
