export default function Preview() {
  const url = (process.env.COMPUTER_URL ?? 'http://localhost:8000') + '/api/display/stream';
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <iframe
        src={url}
        className="scale-50 xl:scale-75 min-w-[1024px] overflow-hidden border"
        style={{
          aspectRatio: 4 / 3,
        }}
      />
    </div>
  );
}
