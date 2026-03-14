export const sendSuccess = (res: any, data: any, message: any) =>
	res.status(200).json({ data, message });
export const sendCreated = (res: any, data: any, message: any) =>
	res.status(201).json({ data, message });
export const sendError = (res: any, message: any, status: number, errors: any) =>
	res.status(status).json({ message, errors });
export const sendNotFound = (res: any, message: any) => res.status(404).json({ message });
export const sendServerError = (res: any, message: any) => res.status(500).json({ message });
