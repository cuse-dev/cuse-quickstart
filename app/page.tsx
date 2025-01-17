import Chat from '@/components/Chat';
import Preview from '@/components/Preview';

export default function Home() {
  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-full">
      <div className="w-full  max-h-[60vh] md:max-h-full">
        <Chat />
      </div>
      <div className="min-h-[40vh] min-w-[360px] md:min-w-[560px] xl:min-w-[820px]">
        <Preview />
      </div>
    </div>
  );
}
