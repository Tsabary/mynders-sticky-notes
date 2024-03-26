export default function handleError(err: unknown, baseMessage: string) {
  let message = baseMessage;
  if (err instanceof Error) message += err.message;
  console.error(message);
  return message;
}
