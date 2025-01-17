export default function Preview() {
  const url = (process.env.COMPUTER_URL ?? 'http://localhost:4242/quickstart-computer') + '/novnc';
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <iframe
        src={url}
        className="scale-50 xl:scale-75 min-w-[1024px] overflow-hidden rounded-xl border-2"
        style={{
          aspectRatio: 4 / 3,
        }}
      />
    </div>
  );
}
